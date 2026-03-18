import { Request, Response } from "express";
import { pipelines } from "../models/pipeline.store.js";
import { jobs, getNextJobId } from "../models/job.store.js";
import type { Job } from "../models/job.model.js";

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

  return res.status(201).json({
    message: "Webhook received",
    job,
  });
};