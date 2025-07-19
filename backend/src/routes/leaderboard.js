const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const type = req.query.type || 'reputation';
    const limit = parseInt(req.query.limit) || 50;

    let sortField = 'reputation';
    if (type === 'accuracy') sortField = 'correctVotes';
    else if (type === 'earned') sortField = 'totalEarned';
    else if (type === 'votes') sortField = 'totalVotes';

    const users = await User.find({ isActive: true })
      .sort({ [sortField]: -1 })
      .limit(limit)
      .select('walletAddress reputation totalVotes correctVotes totalEarned')
      .exec();

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      walletAddress: user.walletAddress,
      reputation: user.reputation,
      totalVotes: user.totalVotes,
      correctVotes: user.correctVotes,
      accuracy: user.accuracy,
      totalEarned: user.totalEarned
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;