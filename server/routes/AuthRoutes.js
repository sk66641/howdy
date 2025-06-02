const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/AuthController');
const jwt = require('jsonwebtoken');

router.post('/register', register).post('/login', login).get('/', (req, res) => {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ userId: decoded.userId });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
});

module.exports = router;