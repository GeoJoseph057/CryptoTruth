const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  reputation: {
    type: Number,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  correctVotes: {
    type: Number,
    default: 0
  },
  totalStaked: {
    type: String,
    default: '0'
  },
  totalEarned: {
    type: String,
    default: '0'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    emailNotifications: { type: Boolean, default: false },
    categories: [String]
  }
}, {
  timestamps: true
});

// Virtual for accuracy percentage
userSchema.virtual('accuracy').get(function() {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.correctVotes / this.totalVotes) * 100);
});

// Indexes for performance
userSchema.index({ walletAddress: 1 });
userSchema.index({ reputation: -1 });
userSchema.index({ totalVotes: -1 });

module.exports = mongoose.model('User', userSchema);