const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, updateAvatar } = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate);
router.put('/', updateProfile);
router.put('/password', changePassword);
router.post('/avatar', upload.single('avatar'), updateAvatar);

module.exports = router;
