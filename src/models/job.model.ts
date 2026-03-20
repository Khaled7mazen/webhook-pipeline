export type JobStatus =
  | "pending"
  | "processing"
  | "retrying"
  | "done"
  | "failed";

export type Job = {
  id: number;
  pipelineId: number;
  originalPayload: unknown;
  processedPayload: unknown | null;
  status: JobStatus;
  delivered: boolean;
  attempts: number;
  maxAttempts: number;
  nextRunAt: Date;
  lockedAt: Date | null;
  lockedBy: string | null;
  lastError: string | null;
  processedAt: Date | null;
};