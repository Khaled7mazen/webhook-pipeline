import { runNextJob } from "./job-runner.service.js";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const startWorker = async () => {
  const workerId =
    process.env.WORKER_ID || `worker-${process.pid}`;

  const pollIntervalMs = Number(process.env.WORKER_POLL_INTERVAL_MS) || 3000;

  console.log(`Worker started: ${workerId}`);

  while (true) {
    try {
      const processed = await runNextJob(workerId);

      if (!processed) {
        await sleep(pollIntervalMs);
      }
    } catch (error) {
      console.error("Worker loop error:", error);
      await sleep(pollIntervalMs);
    }
  }
};