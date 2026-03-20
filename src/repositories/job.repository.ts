import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { jobsTable } from "../db/schema.js";
import type { Job, JobStatus } from "../models/job.model.js";
import { sql } from "drizzle-orm";

const mapJobRow = (row: typeof jobsTable.$inferSelect): Job => ({
  id: row.id,
  pipelineId: row.pipelineId,
  originalPayload: row.originalPayload,
  processedPayload: row.processedPayload,
  status: row.status as JobStatus,
  delivered: row.delivered,
  attempts: row.attempts,
  maxAttempts: row.maxAttempts,
  nextRunAt: row.nextRunAt,
  lockedAt: row.lockedAt,
  lockedBy: row.lockedBy,
  lastError: row.lastError,
  processedAt: row.processedAt,
});

export const createJobRepository = async (input: {
  pipelineId: number;
  payload: unknown;
}): Promise<Job> => {
  const [job] = await db
    .insert(jobsTable)
    .values({
      pipelineId: input.pipelineId,
      originalPayload: input.payload,
      processedPayload: null,
      status: "pending",
      delivered: false,
      attempts: 0,
      maxAttempts: 3,
      nextRunAt: new Date(),
    })
    .returning();

  if (!job) {
    throw new Error("Failed to create job");
  }

  return mapJobRow(job);
};

export const getAllJobsRepository = async (): Promise<Job[]> => {
  const jobs = await db.select().from(jobsTable);
  return jobs.map(mapJobRow);
};

export const getJobByIdRepository = async (id: number): Promise<Job | null> => {
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id));
  return job ? mapJobRow(job) : null;
};

export const getPendingJobsRepository = async (): Promise<Job[]> => {
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.status, "pending"));

  return jobs.map(mapJobRow);
};

export const getCompletedUndeliveredJobsRepository = async (): Promise<Job[]> => {
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.status, "done"), eq(jobsTable.delivered, false)));

  return jobs.map(mapJobRow);
};

export const updateJobStatusRepository = async (
  id: number,
  status: JobStatus,
  payload?: unknown
): Promise<void> => {
  if (payload !== undefined) {
    await db
      .update(jobsTable)
      .set({
        status,
        payload,
        updatedAt: new Date(),
      })
      .where(eq(jobsTable.id, id));

    return;
  }

  await db
    .update(jobsTable)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id));
};

export const markJobDeliveredRepository = async (id: number): Promise<void> => {
  await db
    .update(jobsTable)
    .set({
      delivered: true,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id));
};

export const claimNextJobRepository = async (
  workerId: string
): Promise<Job | null> => {
  const result = await db.execute(sql`
    WITH next_job AS (
      SELECT id
      FROM jobs
      WHERE status IN ('pending', 'retrying')
        AND next_run_at <= NOW()
        AND locked_at IS NULL
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    UPDATE jobs
    SET
      status = 'processing',
      locked_at = NOW(),
      locked_by = ${workerId},
      updated_at = NOW()
    WHERE id = (SELECT id FROM next_job)
    RETURNING *;
  `);

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return mapJobRow(row as typeof jobsTable.$inferSelect);
};


export const markJobDoneRepository = async (
  id: number,
  processedPayload: unknown
): Promise<void> => {
  await db
    .update(jobsTable)
    .set({
      status: "done",
      processedPayload,
      delivered: true,
      processedAt: new Date(),
      lockedAt: null,
      lockedBy: null,
      lastError: null,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id));
};


export const scheduleJobRetryRepository = async (
  id: number,
  attempts: number,
  lastError: string,
  delaySeconds: number
): Promise<void> => {
  const nextRunAt = new Date(Date.now() + delaySeconds * 1000);

  await db
    .update(jobsTable)
    .set({
      status: "retrying",
      attempts,
      lastError,
      nextRunAt,
      lockedAt: null,
      lockedBy: null,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id));
};


export const markJobFailedRepository = async (
  id: number,
  attempts: number,
  lastError: string
): Promise<void> => {
  await db
    .update(jobsTable)
    .set({
      status: "failed",
      attempts,
      lastError,
      lockedAt: null,
      lockedBy: null,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id));
};


export const releaseJobLockRepository = async (id: number): Promise<void> => {
  await db
    .update(jobsTable)
    .set({
      lockedAt: null,
      lockedBy: null,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id));
};

