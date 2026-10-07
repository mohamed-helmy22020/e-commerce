import { pinoHttp } from "pino-http";
import { logger } from "./logger";

export const httpLogger = pinoHttp({
    logger: logger,
    redact: ["req.headers.authorization", "req.headers['x-gateway-secret']"],
});
