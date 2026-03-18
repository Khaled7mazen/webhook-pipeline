import type { Job } from "./job.model.js";

export let jobs: Job[] = [];
let currentJobId = 1;

export const getNextJobId = () => currentJobId++;