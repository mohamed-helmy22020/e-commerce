import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { closePool, getPool } from "../packages/shared/src/db/pool";

config({ path: resolve(process.cwd(), ".env") });

async function main() {
    try {
        const file = process.argv[2] ?? "sql/001_users.sql";
        console.log(`Migrating: ${file}`);
        const sql = readFileSync(resolve(process.cwd(), file), "utf-8");
        const pool = getPool();
        await pool.query(sql);
        console.log(`Migrated: ${file}`);
    } catch (error: any) {
        throw new Error(error);
    } finally {
        await closePool();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
