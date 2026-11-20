
import express from "express";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import db from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Needed when deployed behind a trusted proxy
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Security headers.
// unsafe-inline is temporarily allowed for the existing auth.js
// because it currently injects its CSS through a style element.
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
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    createDatabaseTable: true
});

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

// Limit repeated login and registration attempts
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
        await db.query("SELECT 1");

        app.listen(PORT, () => {
            console.log(`DTR Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to MySQL:", error.message);
        process.exit(1);
    }
}

startServer();
