
import db from "./config/database.js";

async function testConnection() {
    let connection;

    try {
        console.log("Testing Railway MySQL Connection...");

        connection = await db.getConnection();

        const [rows] = await connection.query(`
            SELECT
                DATABASE() AS database_name,
                USER() AS connected_user,
                VERSION() AS mysql_version
        `);

        console.log("MYSQL CONNECTION SUCCESSFUL");
        console.log("Database:", rows[0].database_name);
        console.log("Connected User:", rows[0].connected_user);
        console.log("MySQL Version:", rows[0].mysql_version);

    } catch (error) {
        console.error("MYSQL CONNECTION FAILED:", {
            code: error.code,
            message: error.message
        });

    } finally {
        if (connection) {
            connection.release();
        }

        await db.end();
    }
}

testConnection();
