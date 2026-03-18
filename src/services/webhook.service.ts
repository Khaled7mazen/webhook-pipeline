import { getPipelineByIdService } from "./pipeline.service.js";
import { jobs, getNextJobId } from "../models/job.store.js";
import type { Job } from "../models/job.model.js";

export const createWebhookJobService = (pipelineId: number, payload: unknown) => {
  const pipeline = getPipelineByIdService(pipelineId);

  if (!pipeline) {
    return null;
  }

  const job: Job = {
    id: getNextJobId(),
    pipelineId,
    payload,
    status: "pending",
    delivered: false,
  };

  jobs.push(job);

  return job;
};