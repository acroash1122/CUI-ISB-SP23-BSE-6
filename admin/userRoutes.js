const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path to your User Model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//SP23-BSE-003 user/login route for user authentication -------
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate: Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Validate: Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );

        // 4. Send Response
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role  //role then sent to frontend takes to respective dashboard
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
//SP23-BSE-003 user/login route for user authentication -------



// POST /user/login
router.post('/login', loginUser);

module.exports = router;