import fetch from "node-fetch";
import { getPipelineByIdService } from "./pipeline.service.js";
import {
  getCompletedUndeliveredJobsRepository,
  markJobDeliveredRepository,
} from "../repositories/job.repository.js";
import { createDeliveryAttemptRepository } from "../repositories/delivery.repository.js";

export const deliverJobs = async () => {
  const jobs = await getCompletedUndeliveredJobsRepository();

  for (const job of jobs) {
    const pipeline = await getPipelineByIdService(job.pipelineId);

    if (!pipeline) {
      continue;
    }

    let allDelivered = true;

    for (const url of pipeline.subscribers) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job.payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to deliver to ${url}`);
        }

        await createDeliveryAttemptRepository({
          jobId: job.id,
          subscriberUrl: url,
          status: "success",
          attemptCount: 1,
        });
      } catch (error) {
        allDelivered = false;

        await createDeliveryAttemptRepository({
          jobId: job.id,
          subscriberUrl: url,
          status: "failed",
          attemptCount: 1,
          lastError: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (allDelivered) {
      await markJobDeliveredRepository(job.id);
    }
  }
};