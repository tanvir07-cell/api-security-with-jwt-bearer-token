import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./connection.js";
import authRouter from "./authRoutes.js";
import appRouter from "./appRoutes.js";

const app = express();

app.use([
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  morgan("dev"),
]);

app.use("/api/v1/user", authRouter);
app.use("/api/v1", appRouter);

app.get("/", async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    return res.status(200).json(healthCheck);
  } catch (err) {
    healthCheck.message = err;
    return res.status(503).json(healthCheck.message);
  }
});

app.listen(4000, async () => {
  console.log("Server is listening on port 4000");
  await connectDB();
});
