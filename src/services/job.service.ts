import { getPipelineByIdService } from "./pipeline.service.js";
import { processData } from "./processor.service.js";
import { deliverJobs } from "./delivery.service.js";
import {
  getPendingJobsRepository,
  updateJobStatusRepository,
} from "../repositories/job.repository.js";

export const processPendingJobs = async () => {
  const jobs = await getPendingJobsRepository();

  for (const job of jobs) {
    await updateJobStatusRepository(job.id, "processing");

    const pipeline = await getPipelineByIdService(job.pipelineId);

    if (!pipeline) {
      await updateJobStatusRepository(job.id, "failed");
      continue;
    }

    try {
      const processedPayload = processData(pipeline.action, job.payload);
      await updateJobStatusRepository(job.id, "done", processedPayload);
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      await updateJobStatusRepository(job.id, "failed");
    }
  }

  await deliverJobs();
};