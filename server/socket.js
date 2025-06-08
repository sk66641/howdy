const { Server } = require('socket.io');
const { Message } = require('./models/Message');

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
        console.log('Received message:', message);
        const senderSocketId = userSocketMap.get(message.sender);
        const receiverSocketId = userSocketMap.get(message.receiver);

        const createMessage = await new Message(message).save();

        // console.log('Message saved:', createMessage);

        const messageData = await Message.findById(createMessage._id)
            .populate('sender', 'email firstName lastName color profileImage profileSetup') 
            .populate('receiver', 'email firstName lastName color profileImage profileSetup');


        // console.log('Populated message data:', messageData);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', messageData);
        
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit('receiveMessage', messageData);
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