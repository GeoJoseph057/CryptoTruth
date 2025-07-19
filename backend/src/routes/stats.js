const express = require('express');
const User = require('../models/User');
const Rumor = require('../models/Rumor');
const Vote = require('../models/Vote');
const router = express.Router();

// Get platform statistics
router.get('/', async (req, res) => {
  try {
    const [
      totalUsers,
      totalRumors,
      totalVotes,
      activeRumors,
      resolvedRumors
    ] = await Promise.all([
      User.countDocuments(),
      Rumor.countDocuments(),
      Vote.countDocuments(),
      Rumor.countDocuments({ status: 'active' }),
      Rumor.countDocuments({ resolved: true })
    ]);

    // Calculate total value staked
    const totalStaked = await Vote.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: '$stake' } }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalRumors,
      totalVotes,
      activeRumors,
      resolvedRumors,
      totalStaked: totalStaked[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;