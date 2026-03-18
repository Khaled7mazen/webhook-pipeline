import type { Pipeline } from "./pipeline.model.js";

export let pipelines: Pipeline[] = [];
let currentPipelineId = 1;

export const getNextPipelineId = () => currentPipelineId++;