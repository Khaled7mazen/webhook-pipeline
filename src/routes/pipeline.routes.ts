import { Router } from "express";
import {
  createPipeline,
  getPipelines,
  getPipelineById,
  deletePipeline,
  updatePipeline
} from "../controllers/pipeline.controller.js";

const router = Router();

router.post("/", createPipeline);
router.get("/", getPipelines);
router.get("/:id", getPipelineById);
router.delete("/:id", deletePipeline);
router.patch("/:id", updatePipeline);

export default router;