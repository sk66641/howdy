const express = require('express');
const { searchContacts, getDmContactList } = require('../controllers/ContactsController');
const router = express.Router();

router.post('/contacts', searchContacts).get('/getdmcontacts', getDmContactList);

module.exports = router;