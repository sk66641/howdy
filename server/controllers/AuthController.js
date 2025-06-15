const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {

    try {
        const { fullName, username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const user = new User({
            fullName,
            username,
            email,
            password
        });
        // console.log(user);
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(201).json({
            username: user.username,
            fullName: user.fullName,
            color: user.color,
            profileImage: user.profileImage,
            bio: user.bio,
            _id: user._id
        });

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        // console.log(isPasswordValid);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // console.log("User logged in:", user);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
        // console.log(token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.status(200).json({
            username: user.username,
            fullName: user.fullName,
            color: user.color,
            profileImage: user.profileImage,
            bio: user.bio,
            _id: user._id
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}