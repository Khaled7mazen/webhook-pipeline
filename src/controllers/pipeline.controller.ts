import { Request, Response } from "express";

type Pipeline = {
  id: number;
  name: string;
  action: string;
  subscribers: string[];
};

let pipelines: Pipeline[] = [];
let currentId = 1;

export const createPipeline = (req: Request, res: Response) => {
  const { name, action, subscribers } = req.body;

  if (!name || !action) {
    return res.status(400).json({ error: "name and action required" });
  }

  const pipeline: Pipeline = {
    id: currentId++,
    name,
    action,
    subscribers: subscribers || [],
  };

  pipelines.push(pipeline);

  res.status(201).json(pipeline);
};

export const getPipelines = (req: Request, res: Response) => {
  res.json(pipelines);
};

export const getPipelineById = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const pipeline = pipelines.find(p => p.id === id);

  if (!pipeline) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  res.json(pipeline);
};
