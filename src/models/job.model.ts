export type Job = {
  id: number;
  pipelineId: number;
  payload: any;
  status: "pending" | "processing" | "done" | "failed";
  delivered?: boolean;
};

export let jobs: Job[] = [];
let currentJobId = 1;

export const getNextJobId = () => currentJobId++;