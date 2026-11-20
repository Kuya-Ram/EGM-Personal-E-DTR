
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    port: Number(
        process.env.DB_PORT || process.env.MYSQLPORT || 3306
    ),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Validate database configuration
const requiredVariables = [
    "host",
    "user",
    "password",
    "database"
];

for (const key of requiredVariables) {
    if (!dbConfig[key]) {
        throw new Error(`Missing database configuration: ${key}`);
    }
}

const db = mysql.createPool(dbConfig);

export default db;
