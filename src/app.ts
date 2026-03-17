import express from "express";
import pipelineRoutes from "./routes/pipeline.routes.js"; 

const app = express();
app.use(express.json());

app.use("/pipelines", pipelineRoutes);

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});