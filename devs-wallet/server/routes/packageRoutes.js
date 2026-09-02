const express = require('express');
const router = express.Router();
const { listPackages, purchasePackage, listMyPurchases } = require('../controllers/packageController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', listPackages);
router.get('/my-purchases', listMyPurchases);
router.post('/purchase', purchasePackage);

module.exports = router;
