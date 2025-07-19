const express = require('express');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');
const router = express.Router();

// Generate nonce for wallet authentication
router.post('/nonce', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const nonce = Math.floor(Math.random() * 1000000);
    const message = `Sign this message to authenticate with CryptoTruth: ${nonce}`;

    res.json({ nonce, message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// Verify signature and authenticate
router.post('/verify', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        joinedAt: new Date(),
        lastActive: new Date()
      });
      await user.save();
    } else {
      user.lastActive = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        walletAddress: user.walletAddress,
        reputation: user.reputation,
        totalVotes: user.totalVotes,
        correctVotes: user.correctVotes,
        accuracy: user.accuracy,
        totalStaked: user.totalStaked,
        totalEarned: user.totalEarned,
        joinedAt: user.joinedAt
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;