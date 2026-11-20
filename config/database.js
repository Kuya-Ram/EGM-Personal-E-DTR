
import "dotenv/config";
import mysql from "mysql2/promise";

// ========================================
// DATABASE CONFIGURATION
// ========================================

const getEnv = (primary, fallback) => {
    const primaryValue = process.env[primary];

    if (primaryValue !== undefined && primaryValue !== "") {
        return primaryValue;
    }

    return process.env[fallback];
};

export const dbConfig = {
    host: getEnv("DB_HOST", "MYSQLHOST"),

    port: Number(
        getEnv("DB_PORT", "MYSQLPORT") || 3306
    ),

    user: getEnv("DB_USER", "MYSQLUSER"),

    password: getEnv("DB_PASSWORD", "MYSQLPASSWORD"),

    database: getEnv("DB_NAME", "MYSQLDATABASE")
};

// ========================================
// DATABASE CONFIG DIAGNOSTIC
// ========================================

console.log("DATABASE CONFIG DIAGNOSTIC:", {
    HOST_SOURCE: process.env.DB_HOST
        ? "DB_HOST"
        : process.env.MYSQLHOST
            ? "MYSQLHOST"
            : "MISSING",

    PORT_SOURCE: process.env.DB_PORT
        ? "DB_PORT"
        : process.env.MYSQLPORT
            ? "MYSQLPORT"
            : "DEFAULT_3306",

    USER_SOURCE: process.env.DB_USER
        ? "DB_USER"
        : process.env.MYSQLUSER
            ? "MYSQLUSER"
            : "MISSING",

    PASSWORD_SOURCE: process.env.DB_PASSWORD
        ? "DB_PASSWORD"
        : process.env.MYSQLPASSWORD
            ? "MYSQLPASSWORD"
            : "MISSING",

    DATABASE_SOURCE: process.env.DB_NAME
        ? "DB_NAME"
        : process.env.MYSQLDATABASE
            ? "MYSQLDATABASE"
            : "MISSING",

    PASSWORD_LENGTH: dbConfig.password?.length ?? 0,

    PASSWORD_HAS_OUTER_SPACES:
        dbConfig.password !== dbConfig.password?.trim(),

    NODE_ENV: process.env.NODE_ENV
});

// ========================================
// VALIDATE DATABASE CONFIGURATION
// ========================================

const requiredVariables = [
    "host",
    "user",
    "database",
    "password"
];

for (const key of requiredVariables) {
    if (
        dbConfig[key] === undefined ||
        dbConfig[key] === null ||
        dbConfig[key] === ""
    ) {
        throw new Error(
            `Missing database configuration: ${key}`
        );
    }
}

if (
    !Number.isInteger(dbConfig.port) ||
    dbConfig.port < 1 ||
    dbConfig.port > 65535
) {
    throw new Error("Invalid database configuration: port");
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
        connection = await db.getConnection();

        await connection.ping();

        console.log("MYSQL CONNECTION SUCCESSFUL");

        return true;

    } catch (error) {
        console.error("MYSQL CONNECTION FAILED:", {
            code: error.code,
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
// EXPORT DATABASE
// ========================================

export default db;
