import express from "express";
import apiRoutes from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";
import ApiError from "./utils/ApiError";
import httpStatus from "http-status";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Error handler
app.use(errorHandler);

export default app;
