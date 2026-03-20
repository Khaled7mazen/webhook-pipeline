import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const pipelinesTable = pgTable("pipelines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribersTable = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id")
    .notNull()
    .references(() => pipelinesTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id")
    .notNull()
    .references(() => pipelinesTable.id, { onDelete: "cascade" }),

  originalPayload: jsonb("original_payload").notNull(),
  processedPayload: jsonb("processed_payload"),

  status: text("status").notNull(), // pending | processing | retrying | done | failed
  delivered: boolean("delivered").notNull().default(false),

  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(3),

  nextRunAt: timestamp("next_run_at").notNull().defaultNow(),
  lockedAt: timestamp("locked_at"),
  lockedBy: text("locked_by"),
  lastError: text("last_error"),
  processedAt: timestamp("processed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const deliveriesTable = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  subscriberUrl: text("subscriber_url").notNull(),
  status: text("status").notNull(),
  attemptCount: integer("attempt_count").notNull().default(0),
  lastError: text("last_error"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});