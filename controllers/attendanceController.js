
import db from "../config/database.js";

function getUserId(req, res) {
    const userId = req.session.userId;

    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Please sign in first."
        });
        return null;
    }

    return userId;
}

async function verifyActiveUser(userId) {
    const [users] = await db.execute(
        "SELECT id FROM users WHERE id = ? AND account_status = 'active'",
        [userId]
    );

    return users.length > 0;
}

function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
}

function isValidTime(value) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || "");
}


// Calculate attendance hours based on start and end times

const BASIC_HOURS = 8;
const OT_RATE = 68.75;
const MINUTES_PER_HOUR = 60;

function calculateAttendanceHours(start, end, attendanceType = "regular") {
    const workDateStart = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
    );

    const actualStartMinutes =
        start.getHours() * 60 + start.getMinutes();

    const endMinutes =
        (end.getTime() - workDateStart.getTime()) / 60000;

    // Treat 11:59 PM as 12:00 AM cutoff.
    const effectiveEndMinutes =
        endMinutes === 1439 ? 1440 : endMinutes;

    if (
        !Number.isFinite(actualStartMinutes) ||
        !Number.isFinite(endMinutes) ||
        endMinutes <= actualStartMinutes
    ) {
        throw new Error("Invalid attendance time range.");
    }

    // SUNDAY AND HOLIDAY:
    // All eligible working-time windows are counted as overtime.
    if (
        attendanceType === "sunday" ||
        attendanceType === "holiday"
    ) {
        const morningOTMinutes = getOverlap(
            actualStartMinutes,
            effectiveEndMinutes,
            360,
            480
        );

        const regularMorningMinutes = getOverlap(
            actualStartMinutes,
            effectiveEndMinutes,
            510,
            720
        );

        const regularAfternoonMinutes = getOverlap(
            actualStartMinutes,
            effectiveEndMinutes,
            780,
            1050
        );

        const eveningOTMinutes = getOverlap(
            actualStartMinutes,
            effectiveEndMinutes,
            1080,
            1440
        );

        const overtimeMinutes =
            morningOTMinutes +
            regularMorningMinutes +
            regularAfternoonMinutes +
            eveningOTMinutes;

        const overtimeHours = overtimeMinutes / MINUTES_PER_HOUR;

        return {
            dutyHours: 0,
            overtimeHours: Number(overtimeHours.toFixed(2)),
            undertimeHours: 0,
            undertimeDeduction: 0,
            totalHours: Number(overtimeHours.toFixed(2))
        };
    }

    // Time In between 5:30 AM and 5:59 AM
    // is considered 6:00 AM for computation.
    const startMinutes =
        actualStartMinutes >= 330 && actualStartMinutes < 360
            ? 360
            : actualStartMinutes;

    function getOverlap(actualStart, actualEnd, periodStart, periodEnd) {
        const overlapStart = Math.max(actualStart, periodStart);
        const overlapEnd = Math.min(actualEnd, periodEnd);

        return Math.max(0, overlapEnd - overlapStart);
    }

    // MORNING OT: 6:00 AM - 8:00 AM
    const morningOTMinutes = Math.min(
        120,
        getOverlap(startMinutes, effectiveEndMinutes, 360, 480)
    );

    // REGULAR MORNING: 8:30 AM - 12:00 NN
    const regularMorningMinutes = getOverlap(
        startMinutes,
        effectiveEndMinutes,
        510,
        720
    );

    // REGULAR AFTERNOON: 1:00 PM - 5:30 PM
    const regularAfternoonMinutes = getOverlap(
        startMinutes,
        effectiveEndMinutes,
        780,
        1050
    );

    // EVENING OT: 6:00 PM - 12:00 AM
    const eveningOTMinutes = Math.min(
        360,
        getOverlap(startMinutes, effectiveEndMinutes, 1080, 1440)
    );

    // Maximum regular duty: 8 hours.
    const dutyMinutes = Math.min(
        BASIC_HOURS * MINUTES_PER_HOUR,
        regularMorningMinutes + regularAfternoonMinutes
    );

    // Maximum daily OT: 8 hours.
    const overtimeMinutes = Math.min(
        480,
        morningOTMinutes + eveningOTMinutes
    );

    // UNDERTIME
    const undertimeMinutes = Math.max(
        0,
        BASIC_HOURS * MINUTES_PER_HOUR - dutyMinutes
    );

    const undertimeDeduction =
        (undertimeMinutes / MINUTES_PER_HOUR) * OT_RATE;

    // MIDNIGHT GRACE PERIOD:
    // 12:00 AM - 12:59 AM = no deduction.
    // 1:00 AM onwards = deduction from 12:00 AM.
    let midnightDeduction = 0;

    if (endMinutes >= 1500) {
        const excessMinutesAfterMidnight =
            endMinutes - 1440;

        midnightDeduction =
            (excessMinutesAfterMidnight / MINUTES_PER_HOUR) * OT_RATE;
    }

    const totalDeduction =
        undertimeDeduction + midnightDeduction;

    const dutyHours = dutyMinutes / MINUTES_PER_HOUR;
    const overtimeHours = overtimeMinutes / MINUTES_PER_HOUR;

    const totalHours = dutyHours + overtimeHours;

    return {
        dutyHours: Number(dutyHours.toFixed(2)),
        overtimeHours: Number(overtimeHours.toFixed(2)),
        undertimeHours: Number(
            (undertimeMinutes / MINUTES_PER_HOUR).toFixed(2)
        ),
        undertimeDeduction: Number(totalDeduction.toFixed(2)),
        totalHours: Number(totalHours.toFixed(2))
    };
}




// SAVE MANUAL ATTENDANCE
export async function saveAttendance(req, res) {

    console.log("🔥 ACTIVE ATTENDANCE CONTROLLER: SAVE FUNCTION");

    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        if (!(await verifyActiveUser(userId))) {
            return res.status(403).json({
                success: false,
                message: "Your account is unavailable."
            });
        }

        const {
            attendanceDate,
            timeIn,
            timeOut,
            attendanceType,
            remarks
        } = req.body;

        // Normalize Work Date to YYYY-MM-DD
        let normalizedDate = "";

        if (typeof attendanceDate === "string") {
            if (/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)) {
                normalizedDate = attendanceDate;
            } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(attendanceDate)) {
                const [day, month, year] = attendanceDate.split("/");
                normalizedDate = `${year}-${month}-${day}`;
            }
        }

        // Validate actual calendar date
        const dateParts = normalizedDate.split("-").map(Number);
        const [year, month, day] = dateParts;

        const validDate =
            dateParts.length === 3 &&
            year >= 1900 &&
            month >= 1 && month <= 12 &&
            day >= 1 &&
            day <= new Date(year, month, 0).getDate();

        if (!validDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid work date."
            });
        }

        if (!isValidTime(timeIn) || !isValidTime(timeOut)) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid Time In and Time Out."
            });
        }

        if (!["regular", "sunday", "holiday"].includes(attendanceType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance category."
            });
        }

        // Create local date/time values
        const [inHour, inMinute] = timeIn.split(":").map(Number);
        const [outHour, outMinute] = timeOut.split(":").map(Number);

        const start = new Date(
            year, month - 1, day, inHour, inMinute, 0
        );

        const end = new Date(
            year, month - 1, day, outHour, outMinute, 0
        );

        // Time Out at midnight or earlier means next day
        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }

        const formatDateTime = date => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            const h = String(date.getHours()).padStart(2, "0");
            const min = String(date.getMinutes()).padStart(2, "0");

            return `${y}-${m}-${d} ${h}:${min}:00`;
        };

        const timeInDateTime = formatDateTime(start);
        const timeOutDateTime = formatDateTime(end);

        console.log("===== BEFORE CALCULATION =====");
        console.log("Work Date:", normalizedDate);
        console.log("Time In:", timeIn);
        console.log("Time Out:", timeOut);
        console.log("Start:", start.toString());
        console.log("End:", end.toString());

        const attendanceHours = calculateAttendanceHours(
            start,
            end,
            attendanceType
        );

        console.log("===== CALCULATION RESULT =====");
        console.log(attendanceHours);
        console.log("==============================");

        console.log("========== ACTUAL COMPUTATION RESULT ==========");
        console.log("Attendance Hours Object:", attendanceHours);
        console.log("Duty Hours:", attendanceHours.dutyHours);
        console.log("OT Hours:", attendanceHours.overtimeHours);
        console.log("Undertime Hours:", attendanceHours.undertimeHours);
        console.log("Undertime Deduction:", attendanceHours.undertimeDeduction);
        console.log("================================================");

        const {
            dutyHours,
            overtimeHours,
            undertimeHours,
            undertimeDeduction,
            totalHours
        } = attendanceHours;

        console.log("========== SAVE DUTY COMPUTATION ==========");
        console.log("Attendance Date:", normalizedDate);
        console.log("Time In:", timeIn);
        console.log("Time Out:", timeOut);
        console.log("Start:", start.toString());
        console.log("End:", end.toString());

        console.log("Duty Hours:", dutyHours);
        console.log("Overtime Hours:", overtimeHours);
        console.log("Undertime Hours:", undertimeHours);
        console.log("Undertime Deduction:", undertimeDeduction);
        console.log("Total Hours:", totalHours);

        console.log("============================================");

        
        const [result] = await db.execute(
            `INSERT INTO attendance
            (
                user_id,
                attendance_date,
                time_in,
                time_out,
                total_hours,
                duty_hours,
                overtime_hours,
                undertime_hours,
                undertime_deduction,
                attendance_status,
                attendance_type,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'present', ?, ?)`,
            [
                userId,
                normalizedDate,
                timeInDateTime,
                timeOutDateTime,
                totalHours,
                dutyHours,
                overtimeHours,
                undertimeHours,
                undertimeDeduction,
                attendanceType,
                remarks?.trim() || null
            ]
        );


        const [records] = await db.execute(
            `SELECT *
             FROM attendance
             WHERE id = ? AND user_id = ?`,
            [result.insertId, userId]
        );

        return res.status(201).json({
            success: true,
            message: "EGM_DTR_SAVE_CONTROLLER_CHECK_2026",
            debug: {
                controller: "attendanceController.js",
                function: "saveAttendance",
                database: process.env.DB_NAME,
                calculated: attendanceHours
            },
            attendance: records[0]
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "You already have an attendance record for this date."
            });
        }

        console.error("Save attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save attendance."
        });
    }
}


// MARK EMPLOYEE ABSENT
export async function markAbsent(req, res) {
    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        if (!(await verifyActiveUser(userId))) {
            return res.status(403).json({
                success: false,
                message: "Your account is unavailable."
            });
        }

        const { attendanceDate, remarks } = req.body;

        if (!isValidDate(attendanceDate)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid work date."
            });
        }

        const [result] = await db.execute(
            `INSERT INTO attendance
            (
                user_id,
                attendance_date,
                time_in,
                time_out,
                total_hours,
                attendance_status,
                attendance_type,
                remarks
            )
            VALUES (?, ?, NULL, NULL, 0, 'absent', 'regular', ?)`,
            [
                userId,
                attendanceDate,
                remarks?.trim() || "Absent"
            ]
        );

        const [records] = await db.execute(
            `SELECT *
             FROM attendance
             WHERE id = ? AND user_id = ?`,
            [result.insertId, userId]
        );

        return res.status(201).json({
            success: true,
            message: "Absent record saved successfully.",
            attendance: records[0]
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "An attendance record already exists for this date."
            });
        }

        console.error("Mark absent error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save absent record."
        });
    }
}

// GET TODAY'S ATTENDANCE
export async function getTodayAttendance(req, res) {
    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        const [records] = await db.execute(
            `SELECT *
             FROM attendance
             WHERE user_id = ?
             AND attendance_date = CURDATE()
             LIMIT 1`,
            [userId]
        );

        return res.json({
            success: true,
            attendance: records[0] || null
        });

    } catch (error) {
        console.error("Get today attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve attendance."
        });
    }
}

// GET ATTENDANCE HISTORY
export async function getAttendanceHistory(req, res) {

    console.log("ACTIVE ATTENDANCE CONTROLLER: HISTORY FUNCTION");

    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        console.log("UPDATED GET ATTENDANCE HISTORY IS RUNNING");

        res.set("Cache-Control", "no-store");

        const sql = `
            SELECT
                id,
                user_id,
                DATE_FORMAT(attendance_date, '%Y-%m-%d') AS attendance_date,
                time_in,
                time_out,
                total_hours,
                duty_hours,
                overtime_hours,
                undertime_hours,
                undertime_deduction,
                attendance_status,
                attendance_type,
                remarks,
                created_at
            FROM attendance
            WHERE user_id = ?
            ORDER BY attendance_date DESC, id DESC
        `;

        const [records] = await db.execute(sql, [userId]);

        console.log("ATTENDANCE RECORD SAMPLE:", records[0]);

        console.log("DATABASE FIELDS:", Object.keys(records[0] || {}));

        console.log("COMPUTATION VALUES:", {
            duty_hours: records[0]?.duty_hours,
            overtime_hours: records[0]?.overtime_hours,
            undertime_hours: records[0]?.undertime_hours,
            undertime_deduction: records[0]?.undertime_deduction
        });

        return res.status(200).json({
            success: true,
            attendance: records
        });

    } catch (error) {
        console.error("Get attendance history error:", error);
        console.error("SQL received:", error.sql);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve attendance history."
        });
    }
}

// GET ATTENDANCE ANALYTICS
export async function getAttendanceAnalytics(req, res) {
    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        const sql = `
            SELECT
                YEAR(attendance_date) AS year,
                MONTH(attendance_date) AS month,

                CASE
                    WHEN attendance_status = 'absent'
                        THEN 'absent'

                    WHEN attendance_status = 'present'
                        AND attendance_type = 'regular'
                        AND TIME_FORMAT(time_in, '%H:%i') > '08:30'
                        THEN 'late'

                    ELSE 'present'
                END AS status_category,

                COUNT(*) AS total

            FROM attendance

            WHERE user_id = ?
              AND attendance_status IN ('present', 'absent')

            GROUP BY
                YEAR(attendance_date),
                MONTH(attendance_date),
                status_category

            ORDER BY year DESC, month ASC
        `;

        const [records] = await db.execute(sql, [userId]);

        const years = [
            ...new Set(records.map(record => Number(record.year)))
        ];

        return res.status(200).json({
            success: true,
            years,
            analytics: records
        });

    } catch (error) {
        console.error("Get attendance analytics error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve attendance analytics."
        });
    }
}




// GET DASHBOARD DATA
export async function getDashboardData(req, res) {
    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        const { from, to } = req.query;

        // Check if both dates are provided
        const hasFrom = Boolean(from);
        const hasTo = Boolean(to);

        // Require both dates when filtering
        if (hasFrom !== hasTo) {
            return res.status(400).json({
                success: false,
                message: "Please provide both From and To dates."
            });
        }

        // Validate date range only when provided
        if (hasFrom && hasTo) {
            if (!isValidDate(from) || !isValidDate(to)) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide valid From and To dates (YYYY-MM-DD)."
                });
            }

            if (from > to) {
                return res.status(400).json({
                    success: false,
                    message: "From date cannot be later than To date."
                });
            }
        }

        let sql = `
            SELECT
                id,
                user_id,
                DATE_FORMAT(attendance_date, '%Y-%m-%d') AS attendance_date,
                time_in,
                time_out,
                total_hours,
                duty_hours,
                overtime_hours,
                undertime_hours,
                undertime_deduction,
                attendance_status,
                attendance_type,
                remarks
            FROM attendance
            WHERE user_id = ?
        `;

        const params = [userId];

        // Apply date filter only when both dates exist
        if (hasFrom && hasTo) {
            sql += `
                AND attendance_date >= ?
                AND attendance_date <= ?
            `;

            params.push(from, to);
        }

        sql += `
            ORDER BY attendance_date DESC, id DESC
        `;

        const [records] = await db.execute(sql, params);

        res.set("Cache-Control", "no-store");

        return res.status(200).json({
            success: true,
            period: {
                from: from || null,
                to: to || null,
                type: hasFrom && hasTo ? "filtered" : "overall"
            },
            attendance: records
        });

    } catch (error) {
        console.error("Get dashboard data error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve dashboard data."
        });
    }
}



// UPDATE ATTENDANCE RECORD
export async function updateAttendance(req, res) {
    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        if (!(await verifyActiveUser(userId))) {
            return res.status(403).json({
                success: false,
                message: "Your account is unavailable."
            });
        }

        const { id } = req.params;
        const {
            attendanceDate,
            attendanceType,
            timeIn,
            timeOut,
            remarks
        } = req.body;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID."
            });
        }

        if (!isValidDate(attendanceDate)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid work date."
            });
        }

        if (!["regular", "sunday", "holiday"].includes(attendanceType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance category."
            });
        }

        if (!isValidTime(timeIn) || !isValidTime(timeOut)) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid Time In and Time Out."
            });
        }

        const [year, month, day] = attendanceDate.split("-").map(Number);
        const [inHour, inMinute] = timeIn.split(":").map(Number);
        const [outHour, outMinute] = timeOut.split(":").map(Number);

        const start = new Date(year, month - 1, day, inHour, inMinute);
        const end = new Date(year, month - 1, day, outHour, outMinute);

        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }

        const toSQLDateTime = date => {
            const pad = n => String(n).padStart(2, "0");

            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
        };

        const attendanceHours = calculateAttendanceHours(
            start,
            end,
            attendanceType
        );

        const {
            dutyHours,
            overtimeHours,
            undertimeHours,
            undertimeDeduction,
            totalHours
        } = attendanceHours;

        if (!Number.isFinite(totalHours) || totalHours < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid time range for Time In and Time Out."
            });
        }

        console.log("========== UPDATE DUTY COMPUTATION ==========");
        console.log("Attendance ID:", id);
        console.log("Attendance Date:", attendanceDate);
        console.log("Time In:", timeIn);
        console.log("Time Out:", timeOut);
        console.log("Start:", start.toString());
        console.log("End:", end.toString());

        console.log("Duty Hours:", dutyHours);
        console.log("Overtime Hours:", overtimeHours);
        console.log("Undertime Hours:", undertimeHours);
        console.log("Undertime Deduction:", undertimeDeduction);
        console.log("Total Hours:", totalHours);
        console.log("==============================================");

        
        const [result] = await db.execute(
            `UPDATE attendance
            SET attendance_date = ?,
                time_in = ?,
                time_out = ?,
                total_hours = ?,
                duty_hours = ?,
                overtime_hours = ?,
                undertime_hours = ?,
                undertime_deduction = ?,
                attendance_type = ?,
                remarks = ?
            WHERE id = ? AND user_id = ?`,
            [
                attendanceDate,
                toSQLDateTime(start),
                toSQLDateTime(end),
                totalHours,
                dutyHours,
                overtimeHours,
                undertimeHours,
                undertimeDeduction,
                attendanceType,
                remarks?.trim() || null,
                id,
                userId
            ]
        );


        if (!result.affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found."
            });
        }

        return res.json({
            success: true,
            message: "Attendance updated successfully."
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "An attendance record already exists for that date."
            });
        }

        console.error("Update attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update attendance."
        });
    }
}

// DELETE ATTENDANCE RECORD
export async function deleteAttendance(req, res) {
    try {
        const userId = getUserId(req, res);
        if (!userId) return;

        if (!(await verifyActiveUser(userId))) {
            return res.status(403).json({
                success: false,
                message: "Your account is unavailable."
            });
        }

        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID."
            });
        }

        const [result] = await db.execute(
            `DELETE FROM attendance
             WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found."
            });
        }

        return res.json({
            success: true,
            message: "Attendance deleted successfully."
        });

    } catch (error) {
        console.error("Delete attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete attendance."
        });
    }
}

