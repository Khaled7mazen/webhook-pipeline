import { and, count, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { deliveriesTable } from "../db/schema.js";

export const getDeliveryAttemptsCountRepository = async (
  jobId: number,
  subscriberUrl: string
): Promise<number> => {
  const result = await db
    .select({ count: count() })
    .from(deliveriesTable)
    .where(
      and(
        eq(deliveriesTable.jobId, jobId),
        eq(deliveriesTable.subscriberUrl, subscriberUrl)
      )
    );

  return Number(result[0]?.count ?? 0);
};

export const hasSuccessfulDeliveryRepository = async (
  jobId: number,
  subscriberUrl: string
): Promise<boolean> => {
  const result = await db
    .select()
    .from(deliveriesTable)
    .where(
      and(
        eq(deliveriesTable.jobId, jobId),
        eq(deliveriesTable.subscriberUrl, subscriberUrl),
        eq(deliveriesTable.status, "success")
      )
    );

  return result.length > 0;
};

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


export type DeliveryAttempt = {
  id: number;
  jobId: number;
  subscriberUrl: string;
  status: string;
  attemptCount: number;
  lastError: string | null;
  deliveredAt: Date | null;
  createdAt: Date;
};

const mapDeliveryRow = (
  row: typeof deliveriesTable.$inferSelect
): DeliveryAttempt => ({
  id: row.id,
  jobId: row.jobId,
  subscriberUrl: row.subscriberUrl,
  status: row.status,
  attemptCount: row.attemptCount,
  lastError: row.lastError,
  deliveredAt: row.deliveredAt,
  createdAt: row.createdAt,
});

export const getDeliveriesByJobIdRepository = async (
  jobId: number
): Promise<DeliveryAttempt[]> => {
  const deliveries = await db
    .select()
    .from(deliveriesTable)
    .where(eq(deliveriesTable.jobId, jobId));

  return deliveries.map(mapDeliveryRow);
};