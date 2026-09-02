const express = require('express');
const router = express.Router();
const { getWallet, deposit, withdraw, transfer } = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getWallet);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);

module.exports = router;
