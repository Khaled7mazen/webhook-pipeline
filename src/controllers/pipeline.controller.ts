import { Request, Response } from "express";
import {
  createPipelineService,
  deletePipelineService,
  getAllPipelinesService,
  getPipelineByIdService,
} from "../services/pipeline.service.js";

export const createPipeline = async (req: Request, res: Response) => {
  try {
    const pipeline = await createPipelineService(req.body);
    return res.status(201).json(pipeline);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
};



export const getPipelines = async (_req: Request, res: Response) => {
  const pipelines = await getAllPipelinesService();
  return res.json(pipelines);
};

export const getPipelineById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid pipeline id" });
  }

  const pipeline = await getPipelineByIdService(id);

  if (!pipeline) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  return res.json(pipeline);
};

export const deletePipeline = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid pipeline id" });
  }
  
  const deleted = await deletePipelineService(id);

  if (!deleted) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  return res.json({ message: "Pipeline deleted" });
};