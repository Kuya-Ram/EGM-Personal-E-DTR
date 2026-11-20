
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

// ========================================
// INITIAL CONFIGURATION
// ========================================

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// VALIDATE SESSION SECRET
// ========================================

if (!process.env.SESSION_SECRET) {
    throw new Error(
        "Missing SESSION_SECRET environment variable"
    );
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
app.use(express.urlencoded({ extended: false }));

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

app.use(express.static(path.join(__dirname, "public")));

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Personal DTR backend is running."
    });
});

// ========================================
// START SERVER
// ========================================

async function startServer() {
    let sessionStore;

    try {
        console.log("--------------------------------");
        console.log("STARTING E-DTR SERVER");
        console.log("--------------------------------");

        // Test main MySQL connection
        console.log("Checking MySQL connection...");

        await db.query("SELECT 1");

        console.log(
            "MYSQL DATABASE CONNECTION SUCCESSFUL"
        );

        // Initialize MySQL session storage
        console.log("Initializing MySQL session store...");

        const MySQLStore = MySQLStoreFactory(session);

        sessionStore = new MySQLStore({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,

            createDatabaseTable: true,

            clearExpired: true,
            checkExpirationInterval: 900000,
            expiration: 86400000
        });

        // Session middleware
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

        app.listen(PORT, "0.0.0.0", () => {
            console.log("--------------------------------");
            console.log("E-DTR SERVER STARTED");
            console.log(`Server running on port ${PORT}`);
            console.log("MySQL: Connected");
            console.log("Session Store: Initialized");
            console.log("--------------------------------");
        });

    } catch (error) {
        console.error("--------------------------------");
        console.error("E-DTR SERVER STARTUP FAILED");
        console.error("Error Code:", error.code || "UNKNOWN");
        console.error("Error Message:", error.message);
        console.error("--------------------------------");

        if (sessionStore) {
            sessionStore.close();
        }

        process.exit(1);
    }
}

startServer();
