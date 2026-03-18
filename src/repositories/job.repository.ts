import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { jobsTable } from "../db/schema.js";
import type { Job, JobStatus } from "../models/job.model.js";

const mapJobRow = (row: typeof jobsTable.$inferSelect): Job => ({
  id: row.id,
  pipelineId: row.pipelineId,
  payload: row.payload,
  status: row.status as JobStatus,
  delivered: row.delivered,
});

export const createJobRepository = async (input: {
  pipelineId: number;
  payload: unknown;
}): Promise<Job> => {
  const [job] = await db
    .insert(jobsTable)
    .values({
      pipelineId: input.pipelineId,
      payload: input.payload,
      status: "pending",
      delivered: false,
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