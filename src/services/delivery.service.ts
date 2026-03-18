import fetch from "node-fetch";
import { jobs } from "../models/job.store.js";
import { pipelines } from "../models/pipeline.store.js";

export const deliverJobs = async () => {
  for (const job of jobs) {
    if (job.status !== "done" || job.delivered) {
      continue;
    }

    const pipeline = pipelines.find((p) => p.id === job.pipelineId);

    if (!pipeline) {
      continue;
    }

    let allDelivered = true;

    for (const url of pipeline.subscribers) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job.payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to deliver to ${url}`);
        }

        console.log(`Job ${job.id} delivered to ${url}`);
      } catch (error) {
        console.error(`Error delivering job ${job.id} to ${url}:`, error);
        allDelivered = false;
      }
    }

    job.delivered = allDelivered;
  }
};