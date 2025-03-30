const express = require('express');
const {
  getTransactions,
  deposit,
  withdraw,
  transfer,
} = require('../controllers/transactions');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/').get(getTransactions);
router.route('/deposit').post(deposit);
router.route('/withdraw').post(withdraw);
router.route('/transfer').post(transfer);

module.exports = router;
