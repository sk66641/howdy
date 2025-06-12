const { Server } = require('socket.io');
const { Message } = require('./models/Message');
const { Channel } = require('./models/Channel');

const setUpSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });


    const userSocketMap = new Map();
    // This map holds the relationship between user IDs and their corresponding socket IDs.

    const sendMessage = async (message) => {
        // console.log('Received message:', message);
        const senderSocketId = userSocketMap.get(message.sender);
        const receiverSocketId = userSocketMap.get(message.receiver);

        const createMessage = await new Message(message).save();

        // console.log('Message saved:', createMessage);

        const messageData = await Message.findById(createMessage._id)
            .populate('sender', 'email firstName lastName color profileImage profileSetup')
            .populate('receiver', 'email firstName lastName color profileImage profileSetup');


        if (receiverSocketId && receiverSocketId !== senderSocketId) {
            // console.log('Populated message data:', messageData);
            io.to(receiverSocketId).emit('receiveMessage', messageData);
            
        }
        if (senderSocketId) {
            // console.log('Populated message data: sender', messageData);
            io.to(senderSocketId).emit('receiveMessage', messageData);
        }
    }

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileURL } = message;
        // console.log('Received channel message:', message);
        // const senderSocketId = userSocketMap.get(message.sender);
        // const channelId = message.channelId;

        const newMessage = new Message({ sender, receiver: null, messageType, content, fileURL });

        const createMessage = await newMessage.save();
        // console.log('Channel message saved:', createMessage);
        // console.log("createMessage is here", createMessage)
        const messageData = await Message.findById(createMessage._id)
            .populate('sender', 'email firstName lastName color profileImage profileSetup');

        const channel = await Channel.findByIdAndUpdate(channelId, { $push: { messages: createMessage._id } }, { new: true }).populate('members').exec();

        // console.log("consoling channel, messageData")
        // console.log(channel, messageData);
        // console.log('Populated channel message data:', messageData);
        const finalData = { ...messageData._doc, channelId: channel._id }
        // console.log(finalData)
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSockedId = userSocketMap.get(member._id.toString());
                const adminSockedId = userSocketMap.get(channel.admin._id.toString());
                if (memberSockedId && memberSockedId !== adminSockedId) {
                    console.log('member', memberSockedId)
                    io.to(memberSockedId).emit("receive-channel-message", finalData);
                }
            })
            const adminSockedId = userSocketMap.get(channel.admin._id.toString());
            if (adminSockedId) {
                // console.log('admin', adminSockedId)
                io.to(adminSockedId).emit("receive-channel-message", finalData);
            }
        }
    }

    io.on('connection', (socket) => {

        const userId = socket.handshake.query.userId;


        if (userId) {
            userSocketMap.set(userId, socket.id);
            // console.log('Current userSocketMap:', Array.from(userSocketMap.entries()));
            // console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
        } else {
            console.log('User ID not provided in handshake query');
        }

        socket.on('sendMessage', sendMessage);
        socket.on('send-channel-message', sendChannelMessage);
        socket.on('disconnect', () => {

            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);
                    break;
                }
            }
        });
    });

}

module.exports = { setUpSocket };