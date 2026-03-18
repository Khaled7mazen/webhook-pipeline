import fetch from "node-fetch";
import { jobs } from "../models/job.model.js";
import { pipelines } from "./pipeline.controller.js";

export const deliverJobs = async () => {
  for (const job of jobs) {
    if (job.status === "done" && !job.delivered) {
      const pipeline = pipelines.find(p => p.id === job.pipelineId);
      if (!pipeline) continue;


      let allDelivered = true;

      for (const url of pipeline.subscribers) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job.payload),
          });

          if (!res.ok) throw new Error(`Failed to deliver to ${url}`);
          console.log(`Job ${job.id} delivered to ${url}`);
        } catch (err) {
          console.error(`Error delivering job ${job.id} to ${url}:`, err);
          allDelivered = false;
          // retry logic 
        }
      }

      job.delivered = allDelivered;
    }
  }
};