const { Channel } = require("../models/Channel");
const { Message } = require("../models/Message");
const { User } = require("../models/User");

exports.createChannel = async (req, res) => {
    try {
        const { name, members, userId } = req.body;
        // const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).send("Admin user not found.");
        }

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members are not valid users.");
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        return res.status(201).json({ channel: newChannel });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};


exports.getChannels = async (req, res) => {
    try {
        const { userId } = req.params;
        const channels = await Channel.find({ $or: [{ admin: userId }, { members: userId }] }).sort({ updatedAt: -1 });
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

        console.log(channelId)
        const channelMessages = await Channel.findById(channelId)
            .select('messages')
            .populate({
            path: 'messages',
            populate: { path: 'sender', select: 'firstName, lastName, email, profileImage, profileSetup, color' }
            });
        // console.log(channelMessages);  
        res.status(200).json({channelMessages});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}