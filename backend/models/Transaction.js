
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  senderUpiId: {
    type: String,
    required: true
  },
  receiverUpiId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least 1']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['sent', 'received'],
    required: true
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
