import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import pool, { query } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runSchema() {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await query(schema);
}

export async function setupDatabase() {
    await runSchema();
    console.log("Database schema applied successfully.");
}

export async function closePool() {
    await pool.end();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    setupDatabase()
        .then(() => closePool())
        .catch((err) => {
            console.error("Database setup failed:", err.message);
            process.exit(1);
        });
}
