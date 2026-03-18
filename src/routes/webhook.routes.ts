import { Router } from "express";
import { receiveWebhook, getJobs } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/:pipelineId", receiveWebhook);

export default router;