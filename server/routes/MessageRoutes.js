const express = require('express');
const router = express.Router();
const { Message } = require('../models/Message');
const { getMessages, uploadFile } = require('../controllers/MessageController');
const multer = require('multer');

const uploads = multer({ dest: 'uploads/files' });
router.get('/', getMessages).post('/uploadFile', uploads.single('file'), uploadFile);

module.exports = router;