import { Request, Response } from "express";
import { pipelines, getNextPipelineId } from "../models/pipeline.store.js";
import type { Pipeline, PipelineAction } from "../models/pipeline.model.js";

export const createPipeline = (req: Request, res: Response) => {
  const { name, action, subscribers } = req.body;

  if (!name || !action) {
    return res.status(400).json({ error: "name and action are required" });
  }

  const allowedActions: PipelineAction[] = [
    "uppercase",
    "add_timestamp",
    "filter_field",
  ];

  if (!allowedActions.includes(action)) {
    return res.status(400).json({ error: "invalid action type" });
  }

  if (subscribers && !Array.isArray(subscribers)) {
    return res.status(400).json({ error: "subscribers must be an array" });
  }

  const pipeline: Pipeline = {
    id: getNextPipelineId(),
    name,
    action,
    subscribers: subscribers ?? [],
  };

  pipelines.push(pipeline);

  return res.status(201).json(pipeline);
};

export const getPipelines = (_req: Request, res: Response) => {
  return res.json(pipelines);
};

export const getPipelineById = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const pipeline = pipelines.find((p) => p.id === id);

  if (!pipeline) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  return res.json(pipeline);
};

export const deletePipeline = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = pipelines.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  pipelines.splice(index, 1);

  return res.json({ message: "Pipeline deleted" });
};