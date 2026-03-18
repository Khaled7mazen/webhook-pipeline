import { Router } from "express";
import {
  createPipeline,
  getPipelines,
  getPipelineById,
  deletePipeline
} from "../controllers/pipeline.controller.js";

const router = Router();

router.post("/", createPipeline);
router.get("/", getPipelines);
router.get("/:id", getPipelineById);
router.delete("/:id", deletePipeline);

export default router;