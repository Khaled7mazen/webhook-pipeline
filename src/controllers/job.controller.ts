import { Request, Response } from "express";
import { jobs } from "../models/job.store.js";

export const getAllJobs = (_req: Request, res: Response) => {
  return res.json(jobs);
};

export const getJobById = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.json(job);
};