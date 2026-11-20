
import "dotenv/config";
import mysql from "mysql2/promise";

export const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    port: Number(
        process.env.DB_PORT || process.env.MYSQLPORT || 3306
    ),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD ?? process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE
};

const requiredVariables = ["host", "user", "database"];

for (const key of requiredVariables) {
    if (!dbConfig[key]) {
        throw new Error(
            `Missing database configuration: ${key}`
        );
    }
}

if (
    process.env.NODE_ENV === "production" &&
    !dbConfig.password
) {
    throw new Error("Missing database configuration: password");
}

const db = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;
