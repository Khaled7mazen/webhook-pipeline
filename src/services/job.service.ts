import { jobs } from "../models/job.store.js";
import { pipelines } from "../models/pipeline.store.js";
import { processData } from "./processor.service.js";
import { deliverJobs } from "./delivery.service.js";

export const processPendingJobs = async () => {
  for (const job of jobs) {
    if (job.status !== "pending") {
      continue;
    }

    job.status = "processing";

    const pipeline = pipelines.find((p) => p.id === job.pipelineId);

    if (!pipeline) {
      job.status = "failed";
      continue;
    }

    try {
      job.payload = processData(pipeline.action, job.payload);
      job.status = "done";
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      job.status = "failed";
    }
  }

  await deliverJobs();
};