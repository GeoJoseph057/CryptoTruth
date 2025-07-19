const { ethers } = require('ethers');
const GUITokenABI = require('../../contracts/GUIToken.json');
const RumorVerificationABI = require('../../contracts/RumorVerification.json');

let provider;
let guiTokenContract;
let rumorVerificationContract;

// Initialize Web3 connection
async function connectWeb3() {
  try {
    if (!provider) {
      provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
      console.log('✅ Web3 provider connected');
    }
    return provider;
  } catch (error) {
    console.error('❌ Failed to connect to Web3 provider:', error);
    throw error;
  }
}

// Get contract instances
async function getContracts() {
  try {
    if (!provider) {
      await connectWeb3();
    }

    if (!guiTokenContract) {
      guiTokenContract = new ethers.Contract(
        process.env.GUI_TOKEN_ADDRESS,
        GUITokenABI.abi,
        provider
      );
    }

    if (!rumorVerificationContract) {
      rumorVerificationContract = new ethers.Contract(
        process.env.VERIFICATION_CONTRACT_ADDRESS,
        RumorVerificationABI.abi,
        provider
      );
    }

    return {
      provider,
      guiToken: guiTokenContract,
      rumorVerification: rumorVerificationContract
    };
  } catch (error) {
    console.error('❌ Failed to get contract instances:', error);
    throw error;
  }
}

// Get contract with signer for transactions
async function getContractsWithSigner(privateKey) {
  try {
    const { provider } = await getContracts();
    const wallet = new ethers.Wallet(privateKey, provider);

    const guiTokenWithSigner = guiTokenContract.connect(wallet);
    const rumorVerificationWithSigner = rumorVerificationContract.connect(wallet);

    return {
      provider,
      guiToken: guiTokenWithSigner,
      rumorVerification: rumorVerificationWithSigner
    };
  } catch (error) {
    console.error('❌ Failed to get contracts with signer:', error);
    throw error;
  }
}

// Get user's GUI token balance
async function getGuiBalance(address) {
  try {
    const { guiToken } = await getContracts();
    const balance = await guiToken.balanceOf(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('❌ Failed to get GUI balance:', error);
    throw error;
  }
}

// Get user's faucet eligibility
async function getFaucetInfo(address) {
  try {
    const { guiToken } = await getContracts();
    const balance = await guiToken.balanceOf(address);
    const hasClaimed = await guiToken.hasClaimed(address);
    const lastClaimTime = await guiToken.lastClaimTime(address);

    const canClaim = balance.lt(ethers.utils.parseEther('200')) &&
                    (lastClaimTime.eq(0) ||
                     Date.now() >= lastClaimTime.toNumber() * 1000 + 24 * 60 * 60 * 1000);

    return {
      balance: ethers.utils.formatEther(balance),
      hasClaimed: hasClaimed,
      lastClaimTime: lastClaimTime.toNumber(),
      canClaim: canClaim
    };
  } catch (error) {
    console.error('❌ Failed to get faucet info:', error);
    throw error;
  }
}

// Get rumor details from blockchain
async function getRumorDetails(rumorId) {
  try {
    const { rumorVerification } = await getContracts();
    const details = await rumorVerification.getRumorDetails(rumorId);

    return {
      submitter: details.submitter,
      content: details.content,
      tags: details.tags,
      totalTrueVotes: details.totalTrueVotes.toNumber(),
      totalFalseVotes: details.totalFalseVotes.toNumber(),
      totalTrueStake: ethers.utils.formatEther(details.totalTrueStake),
      totalFalseStake: ethers.utils.formatEther(details.totalFalseStake),
      createdAt: details.createdAt.toNumber(),
      expiresAt: details.expiresAt.toNumber(),
      resolved: details.resolved,
      outcome: details.outcome,
      rewardPool: ethers.utils.formatEther(details.rewardPool)
    };
  } catch (error) {
    console.error('❌ Failed to get rumor details:', error);
    throw error;
  }
}

// Get user's vote on a rumor
async function getUserVote(rumorId, address) {
  try {
    const { rumorVerification } = await getContracts();
    const vote = await rumorVerification.getUserVote(rumorId, address);

    return {
      isTrue: vote.isTrue,
      stake: ethers.utils.formatEther(vote.stake),
      claimed: vote.claimed,
      timestamp: vote.timestamp.toNumber()
    };
  } catch (error) {
    console.error('❌ Failed to get user vote:', error);
    throw error;
  }
}

// Get user stats from blockchain
async function getUserStats(address) {
  try {
    const { rumorVerification } = await getContracts();
    const stats = await rumorVerification.getUserStats(address);

    return {
      reputation: stats.reputation.toNumber(),
      totalVotes: stats.totalVotes.toNumber(),
      correctVotes: stats.correctVotes.toNumber(),
      accuracy: stats.accuracy.toNumber() / 100 // Convert from basis points to percentage
    };
  } catch (error) {
    console.error('❌ Failed to get user stats:', error);
    throw error;
  }
}

// Get active rumors from blockchain
async function getActiveRumors() {
  try {
    const { rumorVerification } = await getContracts();
    const activeRumors = await rumorVerification.getActiveRumors();
    return activeRumors.map(id => id.toNumber());
  } catch (error) {
    console.error('❌ Failed to get active rumors:', error);
    throw error;
  }
}

// Get total rumors count
async function getTotalRumors() {
  try {
    const { rumorVerification } = await getContracts();
    const total = await rumorVerification.getTotalRumors();
    return total.toNumber();
  } catch (error) {
    console.error('❌ Failed to get total rumors:', error);
    throw error;
  }
}

// Check if user can claim reward
async function canClaimReward(rumorId, address) {
  try {
    const { rumorVerification } = await getContracts();
    return await rumorVerification.canClaimReward(rumorId, address);
  } catch (error) {
    console.error('❌ Failed to check claim eligibility:', error);
    throw error;
  }
}

// Get rumor voters
async function getRumorVoters(rumorId) {
  try {
    const { rumorVerification } = await getContracts();
    return await rumorVerification.getRumorVoters(rumorId);
  } catch (error) {
    console.error('❌ Failed to get rumor voters:', error);
    throw error;
  }
}

// Sync rumor from blockchain to database
async function syncRumorFromBlockchain(rumorId) {
  try {
    const details = await getRumorDetails(rumorId);

    // Check if rumor exists in database
    let rumor = await Rumor.findOne({ rumorId });

    if (!rumor) {
      // Create new rumor
      rumor = new Rumor({
        rumorId,
        submitter: details.submitter,
        content: details.content,
        tags: details.tags,
        totalTrueVotes: details.totalTrueVotes,
        totalFalseVotes: details.totalFalseVotes,
        totalTrueStake: details.totalTrueStake,
        totalFalseStake: details.totalFalseStake,
        createdAt: new Date(details.createdAt * 1000),
        expiresAt: new Date(details.expiresAt * 1000),
        resolved: details.resolved,
        outcome: details.outcome
      });
    } else {
      // Update existing rumor
      rumor.totalTrueVotes = details.totalTrueVotes;
      rumor.totalFalseVotes = details.totalFalseVotes;
      rumor.totalTrueStake = details.totalTrueStake;
      rumor.totalFalseStake = details.totalFalseStake;
      rumor.resolved = details.resolved;
      rumor.outcome = details.outcome;
    }

    await rumor.save();
    return rumor;
  } catch (error) {
    console.error('❌ Failed to sync rumor from blockchain:', error);
    throw error;
  }
}

// Sync user stats from blockchain
async function syncUserStatsFromBlockchain(address) {
  try {
    const stats = await getUserStats(address);

    let user = await User.findOne({ walletAddress: address });
    if (!user) {
      user = new User({ walletAddress: address });
    }

    user.reputation = stats.reputation;
    user.totalVotes = stats.totalVotes;
    user.correctVotes = stats.correctVotes;
    user.accuracyPercentage = Math.round(stats.accuracy);

    await user.save();
    return user;
  } catch (error) {
    console.error('❌ Failed to sync user stats from blockchain:', error);
    throw error;
  }
}

// Monitor blockchain events
async function monitorEvents() {
  try {
    const { rumorVerification } = await getContracts();

    // Monitor RumorSubmitted events
    rumorVerification.on('RumorSubmitted', async (rumorId, submitter, content, tags) => {
      console.log(`📝 New rumor submitted: ${rumorId} by ${submitter}`);
      await syncRumorFromBlockchain(rumorId.toNumber());
    });

    // Monitor VoteCast events
    rumorVerification.on('VoteCast', async (rumorId, voter, isTrue, stake) => {
      console.log(`🗳️ Vote cast: ${rumorId} by ${voter} (${isTrue ? 'True' : 'False'})`);
      await syncRumorFromBlockchain(rumorId.toNumber());
    });

    // Monitor RumorResolved events
    rumorVerification.on('RumorResolved', async (rumorId, outcome, totalStake) => {
      console.log(`✅ Rumor resolved: ${rumorId} (${outcome ? 'True' : 'False'})`);
      await syncRumorFromBlockchain(rumorId.toNumber());
    });

    // Monitor RewardsClaimed events
    rumorVerification.on('RewardsClaimed', async (rumorId, user, amount) => {
      console.log(`💰 Rewards claimed: ${rumorId} by ${user} (${ethers.utils.formatEther(amount)} GUI)`);
      await syncUserStatsFromBlockchain(user);
    });

    console.log('👂 Blockchain events monitoring started');
  } catch (error) {
    console.error('❌ Failed to start event monitoring:', error);
    throw error;
  }
}

module.exports = {
  connectWeb3,
  getContracts,
  getContractsWithSigner,
  getGuiBalance,
  getFaucetInfo,
  getRumorDetails,
  getUserVote,
  getUserStats,
  getActiveRumors,
  getTotalRumors,
  canClaimReward,
  getRumorVoters,
  syncRumorFromBlockchain,
  syncUserStatsFromBlockchain,
  monitorEvents
};