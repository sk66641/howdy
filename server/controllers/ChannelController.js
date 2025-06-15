const { Channel } = require("../models/Channel");
const { User } = require("../models/User");
const fs = require('fs')

exports.createChannel = async (req, res) => {
    try {
        const { userId } = req;
        const { name, members } = req.body;
        // const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).send("Admin user not found.");
        }

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members are not valid users.");
        }

        // const newChannel = new Channel({
        //     name,
        //     members,
        //     admin: userId,
        // });

        // await newChannel.save();

        const newChannel = await Channel.create({ name, members, admin: userId });

        const createdChannel = await Channel.findById(newChannel._id)
            .select('-messages -members')
            .populate('admin', '-email -password');


        // rule: Model.create() does not return a Mongoose document instance, but rather a plain object, so you can’t chain .populate() directly on it.

        // newChannel = await newChannel.populate('admin', '-email -password'); // now this works

        console.log(createdChannel);
        return res.status(201).json({ channel: createdChannel });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};


exports.getChannels = async (req, res) => {
    try {
        const { userId } = req;
        const channels = await Channel.find({ $or: [{ admin: userId }, { members: userId }] })
            .sort({ updatedAt: -1 }).select('-messages -members')
            .populate({ path: 'admin', select: '-email -password' });
        return res.status(200).json({ channels });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) return res.status(400).json({ message: "channelId not found" });

        // console.log(channelId)
        const channelMessages = await Channel.findById(channelId)
            .select('messages')
            .populate({
                path: 'messages',
                populate: { path: 'sender', select: '-email -password' }
            });
        // console.log(channelMessages);  
        res.status(200).json({ channelMessages });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.removeMember = async (req, res) => {
    try {
        const { channelId, memberId } = req.body;
        if (!channelId || !memberId) return res.status(400).json({ message: "channelId or memberId not found" });
        await Channel.findByIdAndUpdate(channelId, { $pull: { members: memberId } }, { new: true });
        return res.status(200).json({ memberId });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.getChannelMembers = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) return res.status(400).json({ message: "channelId not found" });
        const channelMembers = await Channel.findById(channelId).select('members').populate('members', '-email -password');
        return res.status(200).json(channelMembers);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.addMembers = async (req, res) => {
    try {
        const { channelId, members } = req.body;
        // console.log(channelId, members);
        if (!channelId || !members) return res.status(400).json({ message: "channelId or memberId not found" });
        const addedMembers = await Channel.findByIdAndUpdate(channelId, { $push: { members: { $each: members } } }, { new: true }).select('members').populate('members', '-email -password');
        return res.status(200).json(addedMembers);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");

    }
}

// const { User } = require('../models/User');
// const multer = require('multer')


exports.updateChannelProfile = async (req, res) => {
    try {
        const { channelId } = req.params;
        const updatedChannel = await Channel.findByIdAndUpdate(
            channelId,
            req.body,
            { new: true, select: '-members -messages' },
        ).populate('admin', '-email -password');

        res.status(200).json(updatedChannel);

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateChannelProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const { channelId } = req.params;

        const fileName = "uploads/channelProfileImages/" + Date.now() + '_' + req.file.originalname;
        fs.renameSync(req.file.path, fileName);
        // console.log(req.file)
        const updatedChannel = await Channel.findByIdAndUpdate( 
            channelId,
            { profileImage: fileName },
            { new: true, select: '-members -messages' }
        ).populate('admin', '-email -password');

        res.status(200).json(updatedChannel);
    } catch (error) {
        console.error("Error updating profile image:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.deleteChannelProfileImage = async (req, res) => {
    const { channelId } = req.params;
    try {
        const channel = await Channel.findById(channelId);
        if (!channel || !channel.profileImage) {
            return res.status(404).json({ message: "Channel or profile image not found" });
        }
        fs.unlinkSync(channel.profileImage);
        channel.profileImage = null;
        await channel.save();
        res.status(200).json({channelId});
    } catch (error) {
        console.error("Error deleting profile image:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
} 