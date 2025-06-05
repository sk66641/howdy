const express = require('express');
const router = express.Router();
const { updateProfile, updateProfileImage, deleteProfileImage } = require('../controllers/ProfileController');
const multer = require('multer');


const uploads = multer({ dest: 'uploads/profileImages' });

router.patch('/:id', updateProfile).post('/image/:id', uploads.single('profileImage'), updateProfileImage).delete('/image/:id', deleteProfileImage);

module.exports = router; 