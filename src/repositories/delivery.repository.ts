import { db } from "../db/index.js";
import { deliveriesTable } from "../db/schema.js";

export const createDeliveryAttemptRepository = async (input: {
  jobId: number;
  subscriberUrl: string;
  status: "success" | "failed";
  attemptCount: number;
  lastError?: string | null;
}) => {
  await db.insert(deliveriesTable).values({
    jobId: input.jobId,
    subscriberUrl: input.subscriberUrl,
    status: input.status,
    attemptCount: input.attemptCount,
    lastError: input.lastError ?? null,
    deliveredAt: input.status === "success" ? new Date() : null,
  });
};