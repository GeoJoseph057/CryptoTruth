const express = require('express');
const router = express.Router();

// Mock data for development
const mockRumors = [
  {
    _id: '1',
    rumorId: 1,
    submitter: '0x1234567890123456789012345678901234567890',
    content: 'Bitcoin will reach $100,000 by end of 2025',
    category: 'Price',
    tags: ['BTC', 'Price', '2025'],
    totalTrueVotes: 1250,
    totalFalseVotes: 890,
    totalTrueStake: '1250000000000000000000',
    totalFalseStake: '890000000000000000000',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    resolved: false,
    outcome: null,
    aiConfidence: 72,
    aiAnalysis: 'AI analysis shows moderate confidence based on market trends.',
    status: 'active'
  },
  {
    _id: '2',
    rumorId: 2,
    submitter: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    content: 'Ethereum 2.0 will cause major network disruption',
    category: 'Tech',
    tags: ['ETH', 'ETH2', 'Network'],
    totalTrueVotes: 456,
    totalFalseVotes: 1890,
    totalTrueStake: '456000000000000000000',
    totalFalseStake: '1890000000000000000000',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    resolved: false,
    outcome: null,
    aiConfidence: 28,
    aiAnalysis: 'AI analysis shows low confidence due to successful testnet operations.',
    status: 'active'
  }
];

const mockUsers = [
  {
    _id: '1',
    walletAddress: '0x1234567890123456789012345678901234567890',
    reputation: 87.3,
    totalVotes: 156,
    correctVotes: 132,
    totalStaked: '1560000000000000000000',
    totalEarned: '892300000000000000000',
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastActive: new Date(),
    isActive: true,
    preferences: {
      emailNotifications: false,
      categories: ['Price', 'Tech']
    }
  }
];

// Mock auth endpoints
router.post('/auth/nonce', (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const nonce = Math.floor(Math.random() * 1000000);
  const message = `Sign this message to authenticate with CryptoTruth: ${nonce}`;

  res.json({ nonce, message });
});

router.post('/auth/verify', (req, res) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // For mock purposes, accept any signature
  const token = 'mock-jwt-token-' + Date.now();

  const user = mockUsers.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()) || {
    walletAddress: walletAddress.toLowerCase(),
    reputation: 0,
    totalVotes: 0,
    correctVotes: 0,
    totalStaked: '0',
    totalEarned: '0',
    joinedAt: new Date(),
    lastActive: new Date(),
    isActive: true,
    preferences: {
      emailNotifications: false,
      categories: []
    }
  };

  res.json({
    token,
    user: {
      walletAddress: user.walletAddress,
      reputation: user.reputation,
      totalVotes: user.totalVotes,
      correctVotes: user.correctVotes,
      accuracy: user.totalVotes > 0 ? Math.round((user.correctVotes / user.totalVotes) * 100) : 0,
      totalStaked: user.totalStaked,
      totalEarned: user.totalEarned,
      joinedAt: user.joinedAt
    }
  });
});

// Mock rumors endpoint
router.get('/rumors', (req, res) => {
  res.json({
    rumors: mockRumors,
    totalPages: 1,
    currentPage: 1,
    total: mockRumors.length
  });
});

// Mock user profile endpoint
router.get('/users/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // For mock purposes, return the first user
  const user = mockUsers[0];
  const userRumors = mockRumors.filter(r => r.submitter.toLowerCase() === user.walletAddress.toLowerCase());

  res.json({
    user: {
      walletAddress: user.walletAddress,
      reputation: user.reputation,
      totalVotes: user.totalVotes,
      correctVotes: user.correctVotes,
      accuracy: user.totalVotes > 0 ? Math.round((user.correctVotes / user.totalVotes) * 100) : 0,
      totalStaked: user.totalStaked,
      totalEarned: user.totalEarned,
      joinedAt: user.joinedAt,
      preferences: user.preferences
    },
    recentVotes: [],
    userRumors
  });
});

// Mock rumor submission
router.post('/rumors', (req, res) => {
  const { content, category, tags, duration } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const newRumor = {
    _id: (mockRumors.length + 1).toString(),
    rumorId: mockRumors.length + 1,
    submitter: '0x1234567890123456789012345678901234567890', // Mock submitter
    content,
    category: category || 'Other',
    tags: tags || [],
    totalTrueVotes: 0,
    totalFalseVotes: 0,
    totalTrueStake: '0',
    totalFalseStake: '0',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + (duration || 24) * 60 * 60 * 1000),
    resolved: false,
    outcome: null,
    aiConfidence: Math.floor(Math.random() * 100),
    aiAnalysis: 'AI analysis pending...',
    status: 'active'
  };

  mockRumors.unshift(newRumor);

  res.status(201).json(newRumor);
});

module.exports = router;