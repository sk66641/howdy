const express = require('express');
const { searchContacts } = require('../controllers/ContactsController');
const router = express.Router();

router.post('/contacts', searchContacts);

module.exports = router;