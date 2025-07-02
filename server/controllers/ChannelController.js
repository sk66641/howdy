const { Channel } = require("../models/Channel");
const { User } = require("../models/User");
const fs = require('fs')
const { ChannelMessage } = require('../models/ChannelMessage');
const { channel } = require("diagnostics_channel");

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

        const io = req.app.get('io');
        members.forEach((memberId) => {
            const memberSocketId = io.userSocketMap.get(memberId.toString());
            if (memberSocketId) {
                io.to(memberSocketId).emit('channel-created', createdChannel);
            }
        });
        // const adminSocketId = io.userSocketMap.get(userId.toString());
        // if (adminSocketId) {
        //     io.to(adminSocketId).emit('channel-created', createdChannel);
        // }

        // console.log(createdChannel);
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

        const channelData = await Channel.findById(channelId)
            .select('messages')
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: '-email -password'
                }
            });

        // Sanitize messages if deleted
        const sanitizedMessages = channelData.messages.map(msg => {
            if (msg.isDeleted) {
                return {
                    _id: msg._id,
                    isDeleted: true,
                    timestamp: msg.timestamp,
                    sender: msg.sender,
                };
            }
            return msg;
        });

        res.status(200).json({ channelMessages: sanitizedMessages });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};


exports.removeMember = async (req, res) => {
    try {
        const { channelId, memberId } = req.body;
        if (!channelId || !memberId) return res.status(400).json({ message: "channelId or memberId not found" });
        const updatedChannel = await Channel.findByIdAndUpdate(channelId, { $pull: { members: memberId } }, { new: true });

        const io = req.app.get('io');
        const memberSocketId = io.userSocketMap.get(memberId.toString());
        if (memberSocketId) {
            io.to(memberSocketId).emit('member-removed', channelId);
        }
        updatedChannel.members.forEach((memberId) => {
            const memberSocketId = io.userSocketMap.get(memberId.toString());
            if (memberSocketId) {
                io.to(memberSocketId).emit('leave-channel', channelId);
            }
        });


        return res.status(200).json({ memberId });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.leaveChannel = async (req, res) => {
    try {
        const { channelId, memberId } = req.body;
        if (!channelId || !memberId) return res.status(400).json({ message: "channelId or memberId not found" });
        const updatedChannel = await Channel.findByIdAndUpdate(channelId, { $pull: { members: memberId } }, { new: true });

        const io = req.app.get('io');
        updatedChannel.members.forEach((memberId) => {
            const memberSocketId = io.userSocketMap.get(memberId.toString());
            if (memberSocketId) {
                io.to(memberSocketId).emit('leave-channel', channelId);
            }
        });
        const adminSockedId = io.userSocketMap.get(updatedChannel.admin._id.toString());
        if (adminSockedId) {
            io.to(adminSockedId).emit('leave-channel', channelId);
        }

        return res.status(200).json({ channelId });
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

        const io = req.app.get('io');
        members.forEach((memberId) => {
            const memberSocketId = io.userSocketMap.get(memberId.toString());
            if (memberSocketId) {
                io.to(memberSocketId).emit('member-added', channelId);
            }
        });

        return res.status(200).json(addedMembers);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");

    }
}

exports.updateChannelProfile = async (req, res) => {
    try {
        const { channelId } = req.params;
        const updatedChannel = await Channel.findByIdAndUpdate(
            channelId,
            req.body,
            { new: true, select: '-messages' },
        ).populate('admin', '-email -password');

        const channel = updatedChannel.toObject();
        delete channel.members;

        const io = req.app.get('io');
        updatedChannel.members.forEach((memberId) => {
            const memberSocketId = io.userSocketMap.get(memberId.toString());
            if (memberSocketId) {
                io.to(memberSocketId).emit('channel-updated', channel);
            }
        });

        res.status(200).json(channel);

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
        res.status(200).json({ channelId });
    } catch (error) {
        console.error("Error deleting profile image:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// exports.deleteChannelMessage = async (req, res) => {
//     try {
//         const { channelMessageId } = req.params;
//         if (!channelMessageId) return res.status(400).json({ message: "channelMessageId not found" });

//         await ChannelMessage.findByIdAndDelete(channelMessageId);
//         return res.status(200).json({ channelMessageId });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send("Internal Server Error");
//     }
// }

// exports.deleteChannelMessageByAdmin = async (req, res) => {
//     try {
//         const { channelMessageId } = req.params;
//         if (!channelMessageId) return res.status(400).json({ message: "channelMessageId not found" });

//         const deletedChannelMessage = await ChannelMessage.findByIdAndUpdate(channelMessageId, { isDeleted: true }, { new: true }).select('-content -fileURL -messageType').populate('sender');
//         return res.status(200).json(deletedChannelMessage);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send("Internal Server Error");
//     }
// }

exports.deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) {
            return res.status(400).json({ message: "channelId not found" });
        }
        const deletedChannel = await Channel.findByIdAndDelete(channelId);
        ``
        const io = req.app.get('io');
        deletedChannel.members.forEach((memberId) => {
            const memberSocketId = io.userSocketMap.get(memberId.toString());
            if (memberSocketId) {
                io.to(memberSocketId).emit('channel-deleted', channelId);
            }
        });

        res.status(200).json({ channelId });
    } catch (error) {
        console.error("Error deleting profile image:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}