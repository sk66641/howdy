const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { User } = require('./models/User')
const cookieParser = require('cookie-parser');
const { setUpSocket } = require('./socket')

const server = express();
dotEnv.config();

server.use(cookieParser());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


server.use('/uploads/profileImages', express.static('uploads/profileImages'));
server.use('/uploads/files', express.static('uploads/files'));

server.use('/auth', require('./routes/AuthRoutes'));
server.use('/profile', require('./routes/ProfileRoutes'));
server.use('/chat', require('./routes/ContactsRoutes'));
server.use('/messages', require('./routes/MessageRoutes'));

const httpServer = server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
}
);
setUpSocket(httpServer);


// TODO: Add verify token middleware to protect routes
// scrollbar hidden in client
// two messages issue if the selectedContact is the user itself