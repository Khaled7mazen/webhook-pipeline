import { getPipelineByIdService } from "./pipeline.service.js";
import { createJobRepository } from "../repositories/job.repository.js";

export const createWebhookJobService = async (
  pipelineId: number,
  payload: unknown
) => {
  const pipeline = await getPipelineByIdService(pipelineId);

  if (!pipeline) {
    return null;
  }

  return createJobRepository({
    pipelineId,
    payload,
  });
};