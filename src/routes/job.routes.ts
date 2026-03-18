import { Router } from "express";
import { getAllJobs, getJobById } from "../controllers/job.controller.js";

const router = Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);

export default router;