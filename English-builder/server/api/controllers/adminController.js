import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const { email, role, level, sort } = req.query;

        const filter = {};

        // Search email
        if (email) {
        filter.email = { $regex: email, $options: "i" };
        }

        // Filter level
        if (level) {
        filter.level = level;
        }

        // Sort
        if (sort === "newest") query = query.sort({ createdAt: -1 });
        if (sort === "oldest") query = query.sort({ createdAt: 1 });
        if (sort === "email") query = query.sort({ email: 1 });
        const users = await User.find(filter).select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const errors = {};

        if (!username) errors.username = "Username is required";
        if (!email) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";

        // simple email regex
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = "Invalid email format";
        }

        if (password && password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }
        // Check existing
        const existing = await User.findOne({ email });
        if (existing) {
        return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || "user",
        });

        res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        });
    } catch (err) {
        res.status(500).json({ message: "Create user failed" });
    }
};

// UPDATE user (role, username, level)
export const updateUser = async (req, res) => {
    try {
        const { username, email, role, level } = req.body;

        const errors = {};

        if (!username) errors.username = "Username is required";
        if (!email) errors.email = "Email is required";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            username,
            email,
            role,
            level,
        },
        { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Update user failed" });
    }
};

// DELETE user
export const deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
        ).select("-password");

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Update role failed" });
    }
};

export const getAdminProfile = async (req, res) => {
    res.json(req.user);
};
