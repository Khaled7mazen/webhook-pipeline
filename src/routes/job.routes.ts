import { Router } from "express";
import { getAllJobs, getJobById } from "../controllers/job.controller.js";
import { getJobDeliveries } from "../controllers/delivery.controller.js";

const router = Router();

router.get("/", getAllJobs);
router.get("/:id/deliveries", getJobDeliveries);
router.get("/:id", getJobById);

export default router;