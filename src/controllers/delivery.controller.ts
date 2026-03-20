import { Request, Response } from "express";
import { getJobByIdService } from "../services/job.service.js";
import { getDeliveriesByJobIdService } from "../services/delivery.service.js";

export const getJobDeliveries = async (req: Request, res: Response) => {
  const jobId = Number(req.params.id);

  if (Number.isNaN(jobId)) {
    return res.status(400).json({ error: "Invalid job id" });
  }

  const job = await getJobByIdService(jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const deliveries = await getDeliveriesByJobIdService(jobId);
  return res.json(deliveries);
};