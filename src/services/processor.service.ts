import type { PipelineAction } from "../models/pipeline.model.js";

export const processData = (type: PipelineAction, payload: unknown) => {
  if (typeof payload !== "object" || payload === null) {
    return payload;
  }

  const data = payload as Record<string, unknown>;

  switch (type) {
    case "uppercase":
      if (typeof data.text === "string") {
        return { ...data, text: data.text.toUpperCase() };
      }
      return data;

    case "add_timestamp":
      return { ...data, timestamp: new Date().toISOString() };

    case "filter_field":
      if ("fieldToKeep" in data) {
        return { fieldToKeep: data.fieldToKeep };
      }
      return {};

    default:
      return data;
  }
};