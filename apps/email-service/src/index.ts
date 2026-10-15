import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
    AppError,
    errorHandler,
    httpLogger,
    logger,
    successResponse,
} from "shared";
import { startKafka } from "./services/email.service";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.EMAIL_PORT || 3002;

const app = express();

app.use(httpLogger);

app.use(express.json());

app.get("/health", (_req, res) => {
    return successResponse(res, { service: "email-service" });
});

app.use((_req, res, next) => {
    next(new AppError("[EMAIL-SERVICE] Not found", 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Email service listening on port ${PORT}`);
});

startKafka().catch((err) => {
    console.error(err);
    process.exit(1);
});
