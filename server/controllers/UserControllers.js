const { User } = require('../models/User');

exports.fetchLoggedInUser = async (req, res) => {
    const { userId } = req;
    try {
        const user = await User.findById(userId).select('-password');
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}