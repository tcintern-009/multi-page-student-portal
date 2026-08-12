import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    console.error(
        "DATABASE_URL is not set. Add your Neon PostgreSQL connection string to backend/.env",
    );
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("neon.tech") ||
        process.env.DATABASE_URL?.includes("sslmode=require") ||
        process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
});

export async function query(text, params) {
    return pool.query(text, params);
}

export async function testConnection() {
    const result = await query("SELECT NOW() AS now");
    return result.rows[0];
}

export default pool;
