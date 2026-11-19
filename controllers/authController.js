
import bcrypt from "bcrypt";
import db from "../config/database.js";

// REGISTER
export async function register(req, res) {
    try {
        const {
            fullName,
            username,
            password,
            confirmPassword,
            basicSalary
        } = req.body;

        if (!fullName || !username || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        if (!/^[a-zA-Z0-9_]{4,50}$/.test(username)) {
            return res.status(400).json({
                success: false,
                message: "Username must be 4-50 characters and contain only letters, numbers, or underscores."
            });
        }

        // Version 1: ₱550/day only
        if (Number(basicSalary) !== 550) {
            return res.status(400).json({
                success: false,
                message: "Invalid salary category."
            });
        }

        const [existing] = await db.execute(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username is already taken."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await db.execute(
            `INSERT INTO users
            (full_name, username, password_hash, role,
             basic_salary, hourly_rate)
            VALUES (?, ?, ?, 'user', 550.00, 68.75)`,
            [fullName.trim(), username, passwordHash]
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful. You can now sign in."
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to complete registration."
        });
    }
}


// LOGIN
export async function login(req, res) {
    try {
        const { username, password, rememberMe } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        const [users] = await db.execute(
            `SELECT id, full_name, username, avatar, password_hash,
                    role, account_status, basic_salary, hourly_rate
            FROM users
            WHERE username = ?
            LIMIT 1`,
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const user = users[0];

        if (user.account_status !== "active") {
            return res.status(403).json({
                success: false,
                message: "This account is disabled."
            });
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        // Regenerate session after successful authentication
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to create login session."
                });
            }

            req.session.userId = user.id;
            req.session.role = user.role;

            // Remember Me: 30 days; otherwise 1 day
            req.session.cookie.maxAge = rememberMe
                ? 30 * 24 * 60 * 60 * 1000
                : 24 * 60 * 60 * 1000;

            req.session.save((saveError) => {
                if (saveError) {
                    return res.status(500).json({
                        success: false,
                        message: "Unable to save login session."
                    });
                }

                return res.json({
                    success: true,
                    message: "Login successful.",
                    user: {
                        id: user.id,
                        fullName: user.full_name,
                        username: user.username,
                        avatar: user.avatar,
                        role: user.role,
                        basicSalary: user.basic_salary,
                        hourlyRate: user.hourly_rate
                    }
                });
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to login."
        });
    }
}


// CURRENT LOGGED-IN USER
export async function getCurrentUser(req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Not logged in."
            });
        }

        const [users] = await db.execute(
            `SELECT id, full_name, username, avatar, role,
                    basic_salary, hourly_rate
            FROM users
            WHERE id = ? AND account_status = 'active'
            LIMIT 1`,
            [req.session.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Account not found or disabled."
            });
        }

        const user = users[0];

        return res.json({
            success: true,
            user: {
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                avatar: user.avatar,
                role: user.role,
                basicSalary: user.basic_salary,
                hourlyRate: user.hourly_rate
            }
        });

    } catch (error) {
        console.error("Current user error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve account."
        });
    }
}


// LOGOUT
export function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to logout."
            });
        }

        res.clearCookie("dtr.sid");

        return res.json({
            success: true,
            message: "Logout successful."
        });
    });
}

// UPDATE PROFILE
export async function updateProfile(req, res) {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not logged in."
            });
        }

        const { fullName, username } = req.body;

        if (!fullName?.trim() || !username?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Full Name and Username are required."
            });
        }

        const cleanFullName = fullName.trim();
        const cleanUsername = username.trim();

        if (cleanFullName.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Full Name must not exceed 150 characters."
            });
        }

        if (!/^[a-zA-Z0-9_]{4,50}$/.test(cleanUsername)) {
            return res.status(400).json({
                success: false,
                message: "Username must be 4-50 characters and contain only letters, numbers, or underscores."
            });
        }

        const [existing] = await db.execute(
            `SELECT id FROM users
             WHERE username = ? AND id != ?
             LIMIT 1`,
            [cleanUsername, userId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username is already taken."
            });
        }

        await db.execute(
            `UPDATE users
             SET full_name = ?, username = ?
             WHERE id = ?`,
            [cleanFullName, cleanUsername, userId]
        );

        const [users] = await db.execute(
            `SELECT id, full_name, username, avatar,
                    role, basic_salary, hourly_rate
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [userId]
        );

        const user = users[0];

        return res.json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                avatar: user.avatar,
                role: user.role,
                basicSalary: user.basic_salary,
                hourlyRate: user.hourly_rate
            }
        });

    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile."
        });
    }
}

/* =========================================================
   UPDATE PASSWORD
   ========================================================= */

export async function updatePassword(req, res) {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not logged in."
            });
        }

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please complete all password fields."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match."
            });
        }

        const [users] = await db.execute(
            `SELECT password_hash
             FROM users
             WHERE id = ? AND account_status = 'active'
             LIMIT 1`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Account not found."
            });
        }

        const passwordIsValid = await bcrypt.compare(
            currentPassword,
            users[0].password_hash
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        await db.execute(
            `UPDATE users
             SET password_hash = ?
             WHERE id = ?`,
            [newPasswordHash, userId]
        );

        return res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        console.error("Password update error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update password."
        });
    }
}