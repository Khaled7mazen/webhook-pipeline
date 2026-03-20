import { Request, Response } from "express";
import { createWebhookJobService } from "../services/webhook.service.js";

export const receiveWebhook = async (req: Request, res: Response) => {
  const pipelineId = Number(req.params.pipelineId);

  if (Number.isNaN(pipelineId)) {
    return res.status(400).json({ error: "Invalid pipeline id" });
  }

  const payload = req.body;

  const job = await createWebhookJobService(pipelineId, payload);

  if (!job) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  return res.status(201).json({
    message: "Webhook received",
    job,
  });
};