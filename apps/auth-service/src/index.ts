import { config } from "dotenv";
import http from "http";
import { resolve } from "node:path";
import { logger } from "shared";
import app from "./app";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.AUTH_PORT || 3001;

async function startServer() {
    const server = http.createServer(app);
    server.listen(PORT, () => {
        logger.info(`Auth service listening on port ${PORT}`);
    });
}

startServer().catch((err) => {
    console.error(err);
    process.exit(1);
});
