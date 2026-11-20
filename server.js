
import "dotenv/config";

import express from "express";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import db, { dbConfig } from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import dns from "node:dns/promises";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate session secret
if (!process.env.SESSION_SECRET) {
    throw new Error("Missing SESSION_SECRET environment variable");
}

// Railway proxy configuration
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false }));

// MySQL-backed session storage
const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    createDatabaseTable: true
});

// Session configuration
app.use(session({
    name: "dtr.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Authentication rate limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again later."
    }
});

app.use("/api/auth", authLimiter);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

// Frontend files
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Personal DTR backend is running."
    });
});

// Start server
async function startServer() {
    try {
        console.log("Checking MySQL connection...");

        await db.query("SELECT 1");

        console.log("MySQL database connected successfully.");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`DTR Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MYSQL CONNECTION FAILED");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        process.exit(1);
    }
}

console.log("DATABASE CONFIG CHECK:", {
    DB_HOST_EXISTS: Boolean(process.env.DB_HOST),
    MYSQLHOST_EXISTS: Boolean(process.env.MYSQLHOST),
    DB_PORT_EXISTS: Boolean(process.env.DB_PORT),
    MYSQLPORT_EXISTS: Boolean(process.env.MYSQLPORT),
    NODE_ENV: process.env.NODE_ENV
});

async function testMySQLDNS() {
    try {
        const result = await dns.lookup(process.env.DB_HOST);

        console.log("MYSQL DNS LOOKUP SUCCESS:", {
            hostname: process.env.DB_HOST,
            address: result.address,
            family: result.family
        });
    } catch (error) {
        console.error("MYSQL DNS LOOKUP FAILED:", {
            hostname: process.env.DB_HOST,
            code: error.code,
            message: error.message
        });
    }
}

await testMySQLDNS();

startServer();
