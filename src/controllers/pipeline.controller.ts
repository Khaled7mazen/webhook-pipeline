import { Request, Response } from "express";
import {
  createPipelineService,
  deletePipelineService,
  getAllPipelinesService,
  getPipelineByIdService,
} from "../services/pipeline.service.js";

export const createPipeline = (req: Request, res: Response) => {
  try {
    const pipeline = createPipelineService(req.body);
    return res.status(201).json(pipeline);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
};

export const getPipelines = (_req: Request, res: Response) => {
  return res.json(getAllPipelinesService());
};

export const getPipelineById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const pipeline = getPipelineByIdService(id);

  if (!pipeline) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  return res.json(pipeline);
};

export const deletePipeline = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = deletePipelineService(id);

  if (!deleted) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  return res.json({ message: "Pipeline deleted" });
};