import { Request, Response } from "express";
import { pipelines } from "./pipeline.controller.js";
import { jobs, Job, getNextJobId } from "../models/job.model.js";

export const receiveWebhook = (req: Request, res: Response) => {
  const pipelineId = Number(req.params.pipelineId);
  const payload = req.body;

  const pipeline = pipelines.find((p) => p.id === pipelineId);

  if (!pipeline) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  const job: Job = {
    id: getNextJobId(),
    pipelineId,
    payload,
    status: "pending",
    delivered: false,
  };

  jobs.push(job);

  res.status(201).json({ message: "Webhook received", job });
};