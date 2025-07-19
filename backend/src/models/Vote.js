const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  rumorId: {
    type: Number,
    required: true,
    ref: 'Rumor'
  },
  voter: {
    type: String,
    required: true,
    lowercase: true
  },
  vote: {
    type: Boolean,
    required: true // true for True, false for False
  },
  stake: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  gasUsed: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  resolved: {
    type: Boolean,
    default: false
  },
  winnings: {
    type: String,
    default: '0'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate votes
voteSchema.index({ rumorId: 1, voter: 1 }, { unique: true });
voteSchema.index({ voter: 1, timestamp: -1 });
voteSchema.index({ rumorId: 1, timestamp: -1 });

module.exports = mongoose.model('Vote', voteSchema);