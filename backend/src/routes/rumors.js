const express = require('express');
const Rumor = require('../models/Rumor');
const Vote = require('../models/Vote');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { analyzeRumor } = require('../utils/ai');
const router = express.Router();

// Get all rumors with pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const status = req.query.status || 'active';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const query = { status };
    if (category && category !== 'all') {
      query.category = category;
    }

    const rumors = await Rumor.find(query)
      .sort({ [sort]: order })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Rumor.countDocuments(query);

    res.json({
      rumors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rumors' });
  }
});

// Get single rumor
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const rumor = await Rumor.findOne({ rumorId: req.params.id });

    if (!rumor) {
      return res.status(404).json({ error: 'Rumor not found' });
    }

    // Check if user has voted on this rumor
    let userVote = null;
    if (req.user) {
      const vote = await Vote.findOne({
        rumorId: rumor.rumorId,
        voter: req.user.walletAddress
      });
      userVote = vote ? { vote: vote.vote, stake: vote.stake } : null;
    }

    res.json({ rumor, userVote });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rumor' });
  }
});

// Create new rumor
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, tags, category, duration } = req.body;

    if (!content || content.length > 500) {
      return res.status(400).json({ error: 'Invalid content' });
    }

    // Generate unique rumor ID
    const lastRumor = await Rumor.findOne().sort({ rumorId: -1 });
    const rumorId = lastRumor ? lastRumor.rumorId + 1 : 1;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (duration || 24));

    const rumor = new Rumor({
      rumorId,
      submitter: req.user.walletAddress,
      content,
      tags: tags || [],
      category: category || 'Other',
      expiresAt
    });

    // Add AI analysis if Cohere API key is available
    if (process.env.COHERE_API_KEY) {
      try {
        const aiAnalysis = await analyzeRumor(content, category || 'Other');
        rumor.aiConfidence = aiAnalysis.confidence;
        rumor.aiAnalysis = aiAnalysis.reasoning;
      } catch (error) {
        console.error('AI analysis failed:', error);
        // Continue without AI analysis
      }
    }

    await rumor.save();
    res.status(201).json(rumor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rumor' });
  }
});

module.exports = router;