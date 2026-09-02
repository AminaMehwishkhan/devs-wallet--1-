const express = require('express');
const router = express.Router();
const { listTransactions, getTransactionById, getDashboardStats } = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', listTransactions);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:id', getTransactionById);

module.exports = router;
