const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/AuthController');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

router.post('/register', register).post('/login', login).get('/logout', logout).get('/', async (req, res) => {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        try {
            const user = await User.findById(decoded._id).select('-password');
            res.json(user);
        } catch (error) { 
            console.error("Error fetching user:", error);
            throw error;
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
});

module.exports = router;