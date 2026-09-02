const express = require('express');
const router = express.Router();
const {
  listBeneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary,
} = require('../controllers/beneficiaryController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', listBeneficiaries);
router.post('/', addBeneficiary);
router.put('/:id', updateBeneficiary);
router.delete('/:id', deleteBeneficiary);

module.exports = router;
