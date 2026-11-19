
import db from "./config/database.js";

async function testConnection() {
    try {
        const connection = await db.getConnection();

        console.log("MySQL Database Connected Successfully!");

        const [rows] = await connection.query(
            "SELECT DATABASE() AS database_name"
        );

        console.log("Connected Database:", rows[0].database_name);

        connection.release();
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
    } finally {
        await db.end();
    }
}

testConnection();
