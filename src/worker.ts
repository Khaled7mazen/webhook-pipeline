import "dotenv/config";
import { startWorker } from "./services/worker.service.js";

startWorker().catch((error) => {
  console.error("Worker failed to start:", error);
  process.exit(1);
});