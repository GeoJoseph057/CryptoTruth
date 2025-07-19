const mongoose = require('mongoose');

const rumorSchema = new mongoose.Schema({
  rumorId: {
    type: Number,
    required: true,
    unique: true
  },
  submitter: {
    type: String,
    required: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 500
  },
  tags: [{
    type: String,
    maxLength: 20
  }],
  category: {
    type: String,
    enum: ['ETF', 'Price', 'Tech', 'Regulation', 'Partnership', 'Other'],
    default: 'Other'
  },
  totalTrueVotes: {
    type: Number,
    default: 0
  },
  totalFalseVotes: {
    type: Number,
    default: 0
  },
  totalTrueStake: {
    type: String,
    default: '0'
  },
  totalFalseStake: {
    type: String,
    default: '0'
  },
  submissionFee: {
    type: String,
    default: '10000000000000000000' // 10 GUI in wei
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  outcome: {
    type: Boolean,
    default: null
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  aiAnalysis: {
    type: String,
    maxLength: 1000
  },
  evidenceLinks: [{
    url: String,
    description: String,
    addedBy: String,
    addedAt: { type: Date, default: Date.now }
  }],
  votingHistory: [{
    voter: String,
    vote: Boolean, // true for True, false for False
    stake: String,
    timestamp: { type: Date, default: Date.now }
  }],
  comments: [{
    author: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'expired', 'resolved', 'disputed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtual for total votes
rumorSchema.virtual('totalVotes').get(function() {
  return this.totalTrueVotes + this.totalFalseVotes;
});

// Virtual for vote percentage
rumorSchema.virtual('trueVotePercentage').get(function() {
  const total = this.totalTrueVotes + this.totalFalseVotes;
  if (total === 0) return 50;
  return Math.round((this.totalTrueVotes / total) * 100);
});

// Indexes
rumorSchema.index({ rumorId: 1 });
rumorSchema.index({ submitter: 1 });
rumorSchema.index({ category: 1 });
rumorSchema.index({ createdAt: -1 });
rumorSchema.index({ expiresAt: 1 });
rumorSchema.index({ resolved: 1 });

module.exports = mongoose.model('Rumor', rumorSchema);