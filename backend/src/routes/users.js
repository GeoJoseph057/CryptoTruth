const express = require('express');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Rumor = require('../models/Rumor');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent votes
    const recentVotes = await Vote.find({ voter: user.walletAddress })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('rumorId', 'content category outcome');

    // Get user-submitted rumors
    const userRumors = await Rumor.find({ submitter: user.walletAddress })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      user: {
        walletAddress: user.walletAddress,
        reputation: user.reputation,
        totalVotes: user.totalVotes,
        correctVotes: user.correctVotes,
        accuracy: user.accuracy,
        totalStaked: user.totalStaked,
        totalEarned: user.totalEarned,
        joinedAt: user.joinedAt,
        preferences: user.preferences
      },
      recentVotes,
      userRumors
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user-submitted rumors
router.get('/rumors', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const rumors = await Rumor.find({ submitter: req.user.walletAddress })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Rumor.countDocuments({ submitter: req.user.walletAddress });

    res.json({
      rumors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user rumors' });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { emailNotifications, categories } = req.body;

    const user = await User.findOneAndUpdate(
      { walletAddress: req.user.walletAddress },
      {
        'preferences.emailNotifications': emailNotifications,
        'preferences.categories': categories
      },
      { new: true }
    );

    res.json({ preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

module.exports = router;