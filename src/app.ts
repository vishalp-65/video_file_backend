import express from "express";
import apiRoutes from "./routes/index";

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);

export default app;
