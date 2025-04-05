
const express = require('express');
const { sendMoney, getTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All transaction routes are protected
router.use(protect);

router.post('/send', sendMoney);
router.get('/', getTransactions);

module.exports = router;
