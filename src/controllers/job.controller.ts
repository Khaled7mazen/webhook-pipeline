import { Request, Response } from "express";
import {
  getAllJobsRepository,
  getJobByIdRepository,
} from "../repositories/job.repository.js";

export const getAllJobs = async (_req: Request, res: Response) => {
  const jobs = await getAllJobsRepository();
  return res.json(jobs);
};

export const getJobById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const job = await getJobByIdRepository(id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.json(job);
};