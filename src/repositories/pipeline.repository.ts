import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { pipelinesTable, subscribersTable } from "../db/schema.js";
import type { Pipeline, PipelineAction } from "../models/pipeline.model.js";

type CreatePipelineInput = {
  name: string;
  action: PipelineAction;
  subscribers: string[];
};

export const createPipelineRepository = async (
  input: CreatePipelineInput
): Promise<Pipeline> => {
  return db.transaction(async (tx) => {
    const [pipeline] = await tx
      .insert(pipelinesTable)
      .values({
        name: input.name,
        action: input.action,
      })
      .returning();

    if (!pipeline) {
      throw new Error("Failed to create pipeline");
    }

    if (input.subscribers.length > 0) {
      await tx.insert(subscribersTable).values(
        input.subscribers.map((url) => ({
          pipelineId: pipeline.id,
          url,
        }))
      );
    }

    return {
      id: pipeline.id,
      name: pipeline.name,
      action: pipeline.action as PipelineAction,
      subscribers: input.subscribers,
    };
  });
};

export const getAllPipelinesRepository = async (): Promise<Pipeline[]> => {
  const pipelines = await db.select().from(pipelinesTable);
  const subscribers = await db.select().from(subscribersTable);

  return pipelines.map((pipeline) => ({
    id: pipeline.id,
    name: pipeline.name,
    action: pipeline.action as PipelineAction,
    subscribers: subscribers
      .filter((subscriber) => subscriber.pipelineId === pipeline.id)
      .map((subscriber) => subscriber.url),
  }));
};

export const getPipelineByIdRepository = async (
  id: number
): Promise<Pipeline | null> => {
  const [pipeline] = await db
    .select()
    .from(pipelinesTable)
    .where(eq(pipelinesTable.id, id));

  if (!pipeline) {
    return null;
  }

  const subscribers = await db
    .select()
    .from(subscribersTable)
    .where(eq(subscribersTable.pipelineId, id));

  return {
    id: pipeline.id,
    name: pipeline.name,
    action: pipeline.action as PipelineAction,
    subscribers: subscribers.map((subscriber) => subscriber.url),
  };
};

export const deletePipelineRepository = async (id: number): Promise<boolean> => {
  const deleted = await db
    .delete(pipelinesTable)
    .where(eq(pipelinesTable.id, id))
    .returning({ id: pipelinesTable.id });

  return deleted.length > 0;
};


type UpdatePipelineInput = {
  id: number;
  name?: string;
  action?: PipelineAction;
  subscribers?: string[];
};

export const updatePipelineRepository = async (
  input: UpdatePipelineInput
): Promise<Pipeline | null> => {
  return db.transaction(async (tx) => {
    const existingPipeline = await tx
      .select()
      .from(pipelinesTable)
      .where(eq(pipelinesTable.id, input.id));

    if (existingPipeline.length === 0) {
      return null;
    }

    if (input.name !== undefined || input.action !== undefined) {
      await tx
        .update(pipelinesTable)
        .set({
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.action !== undefined ? { action: input.action } : {}),
        })
        .where(eq(pipelinesTable.id, input.id));
    }

    if (input.subscribers !== undefined) {
      await tx
        .delete(subscribersTable)
        .where(eq(subscribersTable.pipelineId, input.id));

      if (input.subscribers.length > 0) {
        await tx.insert(subscribersTable).values(
          input.subscribers.map((url) => ({
            pipelineId: input.id,
            url,
          }))
        );
      }
    }

    const [pipeline] = await tx
      .select()
      .from(pipelinesTable)
      .where(eq(pipelinesTable.id, input.id));

    const subscribers = await tx
      .select()
      .from(subscribersTable)
      .where(eq(subscribersTable.pipelineId, input.id));

    if (!pipeline) {
      return null;
    }

    return {
      id: pipeline.id,
      name: pipeline.name,
      action: pipeline.action as PipelineAction,
      subscribers: subscribers.map((subscriber) => subscriber.url),
    };
  });
};