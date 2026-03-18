import type { PipelineAction } from "../models/pipeline.model.js";
import {
  createPipelineRepository,
  deletePipelineRepository,
  getAllPipelinesRepository,
  getPipelineByIdRepository,
} from "../repositories/pipeline.repository.js";

const allowedActions: PipelineAction[] = [
  "uppercase",
  "add_timestamp",
  "filter_field",
];

export const createPipelineService = async (data: {
  name: string;
  action: string;
  subscribers?: string[];
}) => {
  const { name, action, subscribers } = data;

  if (!name || !action) {
    throw new Error("name and action are required");
  }

  if (!allowedActions.includes(action as PipelineAction)) {
    throw new Error("invalid action type");
  }

  if (subscribers && !Array.isArray(subscribers)) {
    throw new Error("subscribers must be an array");
  }

  return createPipelineRepository({
    name,
    action: action as PipelineAction,
    subscribers: subscribers ?? [],
  });
};

export const getAllPipelinesService = async () => {
  return getAllPipelinesRepository();
};

export const getPipelineByIdService = async (id: number) => {
  return getPipelineByIdRepository(id);
};

export const deletePipelineService = async (id: number) => {
  return deletePipelineRepository(id);
};