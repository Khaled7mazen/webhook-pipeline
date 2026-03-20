import fetch from "node-fetch";
import { getPipelineByIdService } from "./pipeline.service.js";
import { processData } from "./processor.service.js";
import {
  claimNextJobRepository,
  markJobDoneRepository,
  markJobFailedRepository,
  scheduleJobRetryRepository,
} from "../repositories/job.repository.js";
import {
  createDeliveryAttemptRepository,
  getDeliveryAttemptsCountRepository,
  hasSuccessfulDeliveryRepository,
} from "../repositories/delivery.repository.js";

const getRetryDelaySeconds = (attempts: number): number => {
  return Math.min(60, attempts * 10);
};

const deliverToSubscribers = async (
  jobId: number,
  subscribers: string[],
  payload: unknown
): Promise<void> => {
  for (const url of subscribers) {
    const alreadyDelivered = await hasSuccessfulDeliveryRepository(jobId, url);

    if (alreadyDelivered) {
      continue;
    }

    const previousAttempts = await getDeliveryAttemptsCountRepository(jobId, url);
    const nextAttempt = previousAttempts + 1;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Delivery failed with status ${response.status}`);
      }

      await createDeliveryAttemptRepository({
        jobId,
        subscriberUrl: url,
        status: "success",
        attemptCount: nextAttempt,
      });
    } catch (error: unknown) {
      await createDeliveryAttemptRepository({
        jobId,
        subscriberUrl: url,
        status: "failed",
        attemptCount: nextAttempt,
        lastError: error instanceof Error ? error.message : "Unknown delivery error",
      });

      throw error;
    }
  }
};

export const runNextJob = async (workerId: string): Promise<boolean> => {
  const job = await claimNextJobRepository(workerId);

  if (!job) {
    return false;
  }

  try {
    const pipeline = await getPipelineByIdService(job.pipelineId);

    if (!pipeline) {
      throw new Error("Pipeline not found for job");
    }

    const processedPayload = processData(pipeline.action, job.originalPayload);

    await deliverToSubscribers(job.id, pipeline.subscribers, processedPayload);

    await markJobDoneRepository(job.id, processedPayload);

    return true;
  } catch (error: unknown) {
    const nextAttempts = job.attempts + 1;
    const message =
      error instanceof Error ? error.message : "Unknown processing error";

    if (nextAttempts >= job.maxAttempts) {
      await markJobFailedRepository(job.id, nextAttempts, message);
    } else {
      await scheduleJobRetryRepository(
        job.id,
        nextAttempts,
        message,
        getRetryDelaySeconds(nextAttempts)
      );
    }

    return true;
  }
};