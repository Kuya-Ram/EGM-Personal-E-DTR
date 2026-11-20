
import "dotenv/config";

import express from "express";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import db, { dbConfig, closeDatabase } from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

// ========================================
// INITIAL CONFIGURATION
// ========================================

const app = express();

const PORT = Number(process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// VALIDATE ENVIRONMENT
// ========================================

if (
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.trim() === ""
) {
    throw new Error(
        "Missing SESSION_SECRET environment variable"
    );
}

if (
    !Number.isInteger(PORT) ||
    PORT < 1 ||
    PORT > 65535
) {
    throw new Error("Invalid server PORT configuration");
}

// ========================================
// RAILWAY PROXY CONFIGURATION
// ========================================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// ========================================
// SECURITY HEADERS
// ========================================

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"]
            }
        }
    })
);

// ========================================
// BODY PARSERS
// ========================================

app.use(express.json({ limit: "20kb" }));

app.use(
    express.urlencoded({
        extended: false,
        limit: "20kb"
    })
);

// ========================================
// AUTHENTICATION RATE LIMITER
// ========================================

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

// ========================================
// FRONTEND FILES
// ========================================

app.use(
    express.static(path.join(__dirname, "public"))
);

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "E-DTR backend is running.",
        status: "online"
    });
});

// ========================================
// MYSQL SESSION STORE
// ========================================

const MySQLStore = MySQLStoreFactory(session);

// ========================================
// START SERVER
// ========================================

let sessionStore;
let server;
let isShuttingDown = false;

async function startServer() {
    try {
        console.log("--------------------------------");
        console.log("STARTING E-DTR SERVER");
        console.log("--------------------------------");

        // ========================================
        // TEST MAIN MYSQL CONNECTION
        // ========================================

        console.log("Checking MySQL connection...");

        await db.query("SELECT 1");

        console.log(
            "MYSQL DATABASE CONNECTION SUCCESSFUL"
        );

        // ========================================
        // INITIALIZE MYSQL SESSION STORE
        // ========================================

        console.log("Initializing MySQL session store...");

        sessionStore = new MySQLStore({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,

            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0,

            createDatabaseTable: true,

            clearExpired: true,
            checkExpirationInterval: 900000,
            expiration: 86400000,

            endConnectionOnClose: true
        });

        // Wait until the session table and store
        // are ready before accepting requests.

        if (typeof sessionStore.onReady !== "function") {
            throw new Error(
                "Unsupported express-mysql-session version. Version 3.x is required."
            );
        }

        await sessionStore.onReady();

        console.log(
            "MYSQL SESSION STORE INITIALIZED SUCCESSFULLY"
        );

        // ========================================
        // SESSION MIDDLEWARE
        // ========================================

        app.use(
            session({
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
            })
        );

        // ========================================
        // API ROUTES
        // ========================================

        app.use("/api/auth", authRoutes);

        app.use("/api/attendance", attendanceRoutes);

        // ========================================
        // START EXPRESS SERVER
        // ========================================

        server = app.listen(PORT, "0.0.0.0", () => {
            console.log("--------------------------------");
            console.log("E-DTR SERVER STARTED");
            console.log("--------------------------------");

            console.log(`Server running on port ${PORT}`);
            console.log("MySQL: Connected");
            console.log("Session Store: Ready");
            console.log("Authentication API: Ready");
            console.log("Attendance API: Ready");

            console.log("--------------------------------");
        });

        server.on("error", (error) => {
            console.error("EXPRESS SERVER ERROR:", {
                code: error.code,
                message: error.message
            });

            process.exitCode = 1;
        });

    } catch (error) {
        console.error("--------------------------------");
        console.error("E-DTR SERVER STARTUP FAILED");
        console.error("--------------------------------");

        console.error({
            code: error.code || "UNKNOWN",
            message: error.message
        });

        console.error("--------------------------------");

        await shutdown(1);
    }
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

async function shutdown(exitCode = 0) {
    if (isShuttingDown) return;

    isShuttingDown = true;

    console.log("Shutting down E-DTR server...");

    try {
        if (server) {
            await new Promise((resolve) => {
                server.close(() => resolve());
            });
        }

        if (sessionStore) {
            await new Promise((resolve, reject) => {
                sessionStore.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            console.log("SESSION STORE CLOSED");
        }

        await closeDatabase();

        console.log("E-DTR SERVER SHUTDOWN COMPLETE");

    } catch (error) {
        console.error("SHUTDOWN ERROR:", error.message);
        exitCode = 1;
    }

    process.exitCode = exitCode;
}

process.once("SIGTERM", () => {
    shutdown(0);
});

process.once("SIGINT", () => {
    shutdown(0);
});

// ========================================
// RUN APPLICATION
// ========================================

startServer();
