
import "dotenv/config";
import mysql from "mysql2/promise";

export const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    port: Number(
        process.env.DB_PORT || process.env.MYSQLPORT || 3306
    ),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE
};

// DATABASE CONFIG DIAGNOSTIC
console.log("DATABASE CONFIG CHECK:", {
    DB_HOST_EXISTS: Boolean(process.env.DB_HOST),
    MYSQLHOST_EXISTS: Boolean(process.env.MYSQLHOST),
    DB_PORT_EXISTS: Boolean(process.env.DB_PORT),
    MYSQLPORT_EXISTS: Boolean(process.env.MYSQLPORT),
    DB_USER_EXISTS: Boolean(process.env.DB_USER),
    MYSQLUSER_EXISTS: Boolean(process.env.MYSQLUSER),
    DB_NAME_EXISTS: Boolean(process.env.DB_NAME),
    MYSQLDATABASE_EXISTS: Boolean(process.env.MYSQLDATABASE),
    NODE_ENV: process.env.NODE_ENV
});

// VALIDATE REQUIRED DATABASE VARIABLES
const requiredVariables = ["host", "user", "database"];

for (const key of requiredVariables) {
    if (!dbConfig[key]) {
        throw new Error(
            `Missing database configuration: ${key}`
        );
    }
}

// VALIDATE DATABASE PASSWORD IN PRODUCTION
if (
    process.env.NODE_ENV === "production" &&
    !dbConfig.password
) {
    throw new Error("Missing database configuration: password");
}

// MYSQL CONNECTION POOL
const db = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;
