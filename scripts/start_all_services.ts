// start-all.ts
import { ChildProcess, spawn } from "child_process";

const ROOT = __dirname;

// List your workspace names (must match the "name" field in each service's package.json)
const services = ["api-gateway", "auth-service"];

// ---- colors + separator ----
const colors = [
    "\x1b[36m",
    "\x1b[35m",
    "\x1b[33m",
    "\x1b[32m",
    "\x1b[34m",
    "\x1b[31m",
];
const RESET = "\x1b[0m";
const SEPARATOR = "=".repeat(60);

let lastSpeaker: string | null = null;

function writeWithSeparator(
    name: string,
    color: string,
    chunk: Buffer,
    stream: NodeJS.WriteStream,
) {
    const text = chunk.toString().trimEnd();
    if (!text) return;

    // separator only when the speaking service changes → keeps logs grouped
    if (lastSpeaker !== name) {
        stream.write(`\n${color}${SEPARATOR}${RESET}\n`);
        lastSpeaker = name;
    }

    const tag = `${color}[${name}]${RESET} `;
    const formatted = text
        .split("\n")
        .map((l) => tag + l)
        .join("\n");

    stream.write(formatted + "\n");
}

const procs: ChildProcess[] = [];

for (const [i, name] of services.entries()) {
    const color = colors[i % colors.length];
    console.log(`🚀 Starting ${name}...`);

    const child = spawn("npm", ["run", "dev", `-w=${name}`], {
        cwd: ROOT,
        stdio: ["ignore", "pipe", "pipe"], // pipe so we can format output
        env: { ...process.env, FORCE_COLOR: "1" },
    });

    child.stdout?.on("data", (d) =>
        writeWithSeparator(name, color, d, process.stdout),
    );
    child.stderr?.on("data", (d) =>
        writeWithSeparator(name, color, d, process.stderr),
    );

    child.on("exit", (code) => console.log(`⚠️  ${name} exited (${code})`));
    child.on("error", (err) => console.error(`❌ ${name}:`, err.message));

    procs.push(child);
}

function shutdown() {
    console.log("\n🛑 Stopping all services...");
    procs.forEach((p) => p.kill("SIGINT"));
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`✅ ${services.length} services started. Ctrl+C to stop all.`);
