export type Job = {
  id: number;
  pipelineId: number;
  payload: any;
  status: "pending" | "processing" | "done" | "failed";
};

export let jobs: Job[] = [];
export let currentJobId = 1;