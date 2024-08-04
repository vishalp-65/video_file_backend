import express from "express";
import apiRoutes from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use(errorHandler);

export default app;
