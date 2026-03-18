import { jobs } from "./webhook.controller.js";
import { pipelines } from "./pipeline.controller.js";
import { processData } from "./processor.controller.js";

export const processPendingJobs = () => {
  jobs.forEach(job => {
    if (job.status === "pending") {
      job.status = "processing";

      const pipeline = pipelines.find(p => p.id === job.pipelineId);

      if (pipeline) {
        job.payload = processData(pipeline.action as any, job.payload);
        job.status = "done";
      } else {
        job.status = "failed";
      }
    }
  });
};