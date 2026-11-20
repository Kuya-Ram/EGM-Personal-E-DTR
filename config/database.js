
import "dotenv/config";
import mysql from "mysql2/promise";

// ========================================
// ENVIRONMENT VARIABLE HELPER
// ========================================

function getEnv(primary, fallback, { trim = true } = {}) {
    for (const key of [primary, fallback]) {
        const value = process.env[key];

        if (value !== undefined && value !== "") {
            const normalized = trim ? value.trim() : value;

            if (normalized !== "") {
                return normalized;
            }
        }
    }

    return undefined;
}

function getEnvSource(primary, fallback, { trim = true } = {}) {
    for (const key of [primary, fallback]) {
        const value = process.env[key];

        if (value !== undefined && value !== "") {
            if (!trim || value.trim() !== "") {
                return key;
            }
        }
    }

    return "MISSING";
}

// ========================================
// DATABASE CONFIGURATION
// ========================================

export const dbConfig = {
    host: getEnv("DB_HOST", "MYSQLHOST"),

    port: Number(
        getEnv("DB_PORT", "MYSQLPORT") || 3306
    ),

    user: getEnv("DB_USER", "MYSQLUSER"),

    // Preserve the exact password value.
    password: getEnv(
        "DB_PASSWORD",
        "MYSQLPASSWORD",
        { trim: false }
    ),

    database: getEnv("DB_NAME", "MYSQLDATABASE")
};

// ========================================
// DATABASE CONFIG DIAGNOSTIC
// ========================================

console.log("--------------------------------");
console.log("DATABASE CONFIG DIAGNOSTIC");
console.log("--------------------------------");

console.log({
    HOST_SOURCE: getEnvSource("DB_HOST", "MYSQLHOST"),

    PORT_SOURCE: getEnvSource("DB_PORT", "MYSQLPORT"),

    USER_SOURCE: getEnvSource("DB_USER", "MYSQLUSER"),

    PASSWORD_SOURCE: getEnvSource(
        "DB_PASSWORD",
        "MYSQLPASSWORD",
        { trim: false }
    ),

    DATABASE_SOURCE: getEnvSource(
        "DB_NAME",
        "MYSQLDATABASE"
    ),

    PASSWORD_EXISTS: Boolean(dbConfig.password),

    PASSWORD_LENGTH: dbConfig.password?.length ?? 0,

    PASSWORD_HAS_OUTER_SPACES:
        dbConfig.password !== undefined &&
        dbConfig.password !== dbConfig.password.trim(),

    NODE_ENV: process.env.NODE_ENV || "undefined"
});

console.log("--------------------------------");

// ========================================
// VALIDATE DATABASE CONFIGURATION
// ========================================

const requiredVariables = [
    "host",
    "user",
    "password",
    "database"
];

for (const key of requiredVariables) {
    if (
        typeof dbConfig[key] !== "string" ||
        dbConfig[key].trim() === ""
    ) {
        throw new Error(
            `Missing or invalid database configuration: ${key}`
        );
    }
}

if (
    !Number.isInteger(dbConfig.port) ||
    dbConfig.port < 1 ||
    dbConfig.port > 65535
) {
    throw new Error(
        "Invalid database configuration: port"
    );
}

// ========================================
// MYSQL CONNECTION POOL
// ========================================

const db = mysql.createPool({
    ...dbConfig,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// ========================================
// TEST DATABASE CONNECTION
// ========================================

export async function testConnection() {
    let connection;

    try {
        console.log("Checking MySQL connection...");

        connection = await db.getConnection();

        await connection.ping();

        console.log("--------------------------------");
        console.log("MYSQL CONNECTION SUCCESSFUL");
        console.log("--------------------------------");

        return true;

    } catch (error) {
        console.error("--------------------------------");
        console.error("MYSQL CONNECTION FAILED");
        console.error("--------------------------------");

        console.error({
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            message: error.message
        });

        return false;

    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// ========================================
// CLOSE DATABASE POOL
// ========================================

export async function closeDatabase() {
    try {
        await db.end();

        console.log("MYSQL CONNECTION POOL CLOSED");

    } catch (error) {
        console.error(
            "MYSQL POOL SHUTDOWN FAILED:",
            error.message
        );

        throw error;
    }
}

// ========================================
// EXPORT DATABASE
// ========================================

export default db;
