const { User } = require('../models/User');

exports.fetchLoggedInUser = async (req, res) => {
    // console.log("updateProfile called")
    const { id } = req.params;
    // console.log(id)
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}