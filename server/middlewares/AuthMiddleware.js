const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded token:", decoded);
        req.userId = decoded._id;
        next();
    } catch (error) {
        // console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};