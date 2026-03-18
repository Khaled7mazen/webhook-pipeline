import { Request, Response } from "express";
import { pipelines } from "../controllers/pipeline.controller.js";

export type Job = {
  id: number;
  pipelineId: number;
  payload: any;
  status: "pending" | "processing" | "done" | "failed";
};

export let jobs: Job[] = [];
let jobIdCounter = 1;

export const receiveWebhook = (req: Request, res: Response) => {
  const pipelineId = Number(req.params.pipelineId);
  const payload = req.body;

  const pipeline = pipelines.find(p => p.id === pipelineId);
  if (!pipeline) return res.status(404).json({ error: "Pipeline not found" });

  const job: Job = {
    id: jobIdCounter++,
    pipelineId,
    payload,
    status: "pending",
  };

  jobs.push(job);

  res.status(201).json({ message: "Webhook received", job });
};

export const getJobs = (req: Request, res: Response) => {
  res.json(jobs);
};