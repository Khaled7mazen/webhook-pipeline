import express from "express";
import pipelineRoutes from "./routes/pipeline.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import jobRoutes from "./routes/job.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
const app = express();

app.use(express.json());

app.use("/pipelines", pipelineRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/jobs", jobRoutes);

app.get("/", (_req, res) => {
  res.send("Server running 🚀");
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

//psql postgres://postgres:postgres@localhost:5432/webhook_pipeline