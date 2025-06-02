const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { User } = require('./models/User')
const cookieParser = require('cookie-parser');

const server = express();
dotEnv.config();

server.use(cookieParser());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

server.use('/auth', require('./routes/AuthRoutes'));

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
}
);
