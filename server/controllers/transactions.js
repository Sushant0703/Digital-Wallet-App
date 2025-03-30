const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Add money to wallet (deposit)
// @route   POST /api/transactions/deposit
// @access  Private
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid amount',
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user's wallet balance
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { walletBalance: amount } },
        { session }
      );

      // Create transaction record
      const transaction = await Transaction.create(
        [
          {
            sender: req.user.id,
            recipient: req.user.id,
            amount,
            type: 'deposit',
            description: 'Wallet deposit',
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        data: transaction[0],
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Withdraw money from wallet
// @route   POST /api/transactions/withdraw
// @access  Private
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid amount',
      });
    }

    // Check if user has enough balance
    const user = await User.findById(req.user.id);

    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user's wallet balance
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { walletBalance: -amount } },
        { session }
      );

      // Create transaction record
      const transaction = await Transaction.create(
        [
          {
            sender: req.user.id,
            recipient: req.user.id,
            amount,
            type: 'withdrawal',
            description: 'Wallet withdrawal',
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        data: transaction[0],
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Transfer money to another user
// @route   POST /api/transactions/transfer
// @access  Private
exports.transfer = async (req, res) => {
  try {
    const { recipientEmail, amount, description } = req.body;

    // Validate amount and recipient
    if (!recipientEmail || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide recipient email and valid amount',
      });
    }

    // Check if recipient exists
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found',
      });
    }

    // Check if user is trying to send money to themselves
    if (recipient._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot transfer money to yourself',
      });
    }

    // Check if user has enough balance
    const sender = await User.findById(req.user.id);
    if (sender.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Deduct amount from sender
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { walletBalance: -amount } },
        { session }
      );

      // Add amount to recipient
      await User.findByIdAndUpdate(
        recipient._id,
        { $inc: { walletBalance: amount } },
        { session }
      );

      // Create transaction record
      const transaction = await Transaction.create(
        [
          {
            sender: req.user.id,
            recipient: recipient._id,
            amount,
            type: 'transfer',
            description: description || 'Money transfer',
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        data: transaction[0],
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
