import express from "express";
import apiRoutes from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
