import { Request, Response } from "express";
import {
  getAllJobsService,
  getJobByIdService,
} from "../services/job.service.js";

export const getAllJobs = async (_req: Request, res: Response) => {
  const jobs = await getAllJobsService();
  return res.json(jobs);
};

export const getJobById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid job id" });
  }

  const job = await getJobByIdService(id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.json(job);
};