const express = require('express');
const router = express.Router();
const { listBills, payBill } = require('../controllers/billController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', listBills);
router.post('/pay', payBill);

module.exports = router;
