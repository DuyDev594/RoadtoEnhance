import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "user"
    });

    await newUser.save();

    res.status(201).json({
        message: "User registered successfully"
    });
    } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    }
};

//login controller

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );


        res.status(200).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            level: user.level,
            hasTakenPlacementTest: user.hasTakenPlacementTest
        }
        });
    } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    }
};
