const express = require('express');
const router = express.Router();
const {
  listGoals, createGoal, updateGoal, deleteGoal, contributeToGoal,
} = require('../controllers/savingsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', listGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/contribute', contributeToGoal);

module.exports = router;
