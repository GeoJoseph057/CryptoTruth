const express = require('express');
const User = require('../models/User');
const Vote = require('../models/Vote');
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
      recentVotes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
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