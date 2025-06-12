const express = require('express');
const router = express.Router();
const { createChannel, getChannels, getChannelMessages } = require('../controllers/ChannelController');

router.post('/', createChannel).get('/:userId', getChannels).get('/messages/:channelId',getChannelMessages);

module.exports = router;