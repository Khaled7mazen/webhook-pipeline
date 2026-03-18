export type JobStatus = "pending" | "processing" | "done" | "failed";

export type Job = {
  id: number;
  pipelineId: number;
  payload: unknown;
  status: JobStatus;
  delivered: boolean;
};