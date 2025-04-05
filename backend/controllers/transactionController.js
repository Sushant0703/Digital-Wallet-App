const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Send money to another user
// @route   POST /api/transactions/send
// @access  Private
exports.sendMoney = async (req, res) => {
  try {
    const { receiverUpiId, amount } = req.body;
    const senderUpiId = req.user.upiId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const sender = await User.findOne({ upiId: senderUpiId });
    const receiver = await User.findOne({ upiId: receiverUpiId });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Start session for transaction (optional safety)
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Update balances
      sender.balance -= amount;
      receiver.balance += amount;

      await sender.save({ session });
      await receiver.save({ session });

      // Create one transaction record
      const transaction = new Transaction({
        senderUpiId,
        receiverUpiId,
        amount,
        type: 'sent' // 'sent' from sender's perspective
      });

      await transaction.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: 'Transaction successful',
        transaction,
        balance: sender.balance
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Transaction failed', error: error.message });
  }
};

// @desc    Get user's transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const userUpiId = req.user.upiId;

    const transactions = await Transaction.find({
      $or: [{ senderUpiId: userUpiId }, { receiverUpiId: userUpiId }]
    }).sort({ timestamp: -1 });

    if (transactions.length === 0) {
      // Demo data if user is new
      const demoTransactions = [
        {
          id: "demo1",
          senderUpiId: userUpiId,
          receiverUpiId: "coffee@fastpay",
          amount: 120,
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          type: "sent"
        },
        {
          id: "demo2",
          senderUpiId: "salary@company",
          receiverUpiId: userUpiId,
          amount: 5000,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          type: "received"
        },
        {
          id: "demo3",
          senderUpiId: userUpiId,
          receiverUpiId: "rent@fastpay",
          amount: 1500,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          type: "sent"
        },
        {
          id: "demo4",
          senderUpiId: "friend@fastpay",
          receiverUpiId: userUpiId,
          amount: 350,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          type: "received"
        },
        {
          id: "demo5",
          senderUpiId: userUpiId,
          receiverUpiId: "shopping@fastpay",
          amount: 750,
          timestamp: new Date(),
          type: "sent"
        }
      ];
      return res.json(demoTransactions);
    }

    const transformedTransactions = transactions.map(tx => {
      const type = tx.senderUpiId === userUpiId ? 'sent' : 'received';
      return {
        id: tx._id,
        senderUpiId: tx.senderUpiId,
        receiverUpiId: tx.receiverUpiId,
        amount: tx.amount,
        timestamp: tx.timestamp,
        type
      };
    });

    res.json(transformedTransactions);

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to get transactions', error: error.message });
  }
};
