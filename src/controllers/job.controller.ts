import { Request, Response } from "express";
import { jobs } from "../models/job.model.js";

export const getAllJobs = (req: Request, res: Response) => {
  res.json(jobs);
};

export const getJobById = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
};