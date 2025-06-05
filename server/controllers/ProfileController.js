const { User } = require('../models/User');
const multer = require('multer')
const fs = require('fs')

exports.updateProfile = async (req, res) => {
    // console.log("updateProfile called")
    const { id } = req.params;
    // console.log(id)
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true, select: '-password' },
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateProfileImage = async (req, res) => {
    // console.log(req)
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const { id } = req.params;
    const fileName = "uploads/profileImages/" + Date.now() + '_' + req.file.originalname;
    fs.renameSync(req.file.path, fileName);
    console.log(req.file)
    console.log(req.file.path)
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { profileImage: fileName },
            { new: true, select: '-password' }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile image:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.deleteProfileImage = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user || !user.profileImage) {
            return res.status(404).json({ message: "User or profile image not found" });
        }
        fs.unlinkSync(user.profileImage);
        user.profileImage = null;
        await user.save();
        res.status(200).json({ message: "Profile image deleted successfully" });
    } catch (error) {
        console.error("Error deleting profile image:", error);
        return res.status(500).json({ message: "Internal server error" }); 
    }
}