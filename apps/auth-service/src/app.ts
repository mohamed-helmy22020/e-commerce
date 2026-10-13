import cookieParser from "cookie-parser";
import express from "express";
import {
    AppError,
    errorHandler,
    httpLogger,
    requireGatewaySecret,
    successResponse,
} from "shared";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

const app = express();

app.use(httpLogger);

app.use(express.json());
app.use(cookieParser());
app.get("/health", (_req, res) => {
    return successResponse(res, { service: "auth-service" });
});

app.use("/auth", requireGatewaySecret, authRoutes);
app.use("/user", requireGatewaySecret, userRoutes);

app.use((_req, res, next) => {
    next(new AppError("[AUTH SERVICE] Route not found", 404));
});

app.use(errorHandler);

export default app;
