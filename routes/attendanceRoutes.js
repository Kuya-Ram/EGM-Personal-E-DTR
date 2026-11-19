import express from "express";
import {
    saveAttendance,
    markAbsent,
    getTodayAttendance,
    getAttendanceHistory,
    getAttendanceAnalytics,
    getDashboardData,
    updateAttendance,
    deleteAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/save", saveAttendance);
router.post("/absent", markAbsent);
router.get("/today", getTodayAttendance);
router.get("/history", getAttendanceHistory);
router.get("/analytics", getAttendanceAnalytics);
router.get("/dashboard", getDashboardData);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

export default router;