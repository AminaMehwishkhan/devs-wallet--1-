const express = require('express');
const router = express.Router();
const {
  listUsers, updateUserStatus, listAllTransactions, getReports,
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.use(authenticate, requireRole('admin'));
router.get('/users', listUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/transactions', listAllTransactions);
router.get('/reports', getReports);

module.exports = router;
