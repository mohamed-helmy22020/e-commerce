import cors from "cors";
import { config } from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";
import { resolve } from "node:path";
import {
    AppError,
    errorHandler,
    httpLogger,
    logger,
    successResponse,
} from "shared";
import { gatewayAuth } from "./middleware/gatewayAuth";
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL =
    process.env.AUTH_SERVICE_URL || "http://localhost:3001";

const app = express();

app.use(helmet());
app.use(cors());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: false,
    }),
);

app.use(httpLogger);

app.use("/health", (_req, res) => {
    successResponse(res, { service: "api-gateway" });
});

// create proxy middleware
app.use(
    "/auth",
    gatewayAuth,
    createProxyMiddleware({
        target: AUTH_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: (path) => `/auth${path}`,
    }),
);

app.get("/", (_req, res) => {
    res.send("E-commerce API");
});

app.use((_req, _res, next) => {
    next(new AppError("[API GATEWAY] Route not found", 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Api gateway listening on port ${PORT}`);
});
