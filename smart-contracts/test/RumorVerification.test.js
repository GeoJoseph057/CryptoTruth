const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoTruth Contracts", function () {
  let guiToken, rumorVerification, owner, user1, user2, user3, user4;
  const SUBMISSION_FEE = ethers.utils.parseEther("10");
  const MIN_STAKE = ethers.utils.parseEther("1");
  const MAX_STAKE = ethers.utils.parseEther("5");
  const FAUCET_AMOUNT = ethers.utils.parseEther("50");

  beforeEach(async function () {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();

    // Deploy GUI Token
    const GUIToken = await ethers.getContractFactory("GUIToken");
    guiToken = await GUIToken.deploy();
    await guiToken.deployed();

    // Deploy RumorVerification
    const RumorVerification = await ethers.getContractFactory("RumorVerification");
    rumorVerification = await RumorVerification.deploy(guiToken.address);
    await rumorVerification.deployed();

    // Fund users with GUI tokens via faucet
    await guiToken.connect(user1).faucet();
    await guiToken.connect(user2).faucet();
    await guiToken.connect(user3).faucet();
    await guiToken.connect(user4).faucet();
  });

  describe("GUIToken", function () {
    it("Should have correct initial supply", async function () {
      const totalSupply = await guiToken.totalSupply();
      expect(totalSupply).to.equal(ethers.utils.parseEther("10000000"));
    });

    it("Should allow faucet usage", async function () {
      const initialBalance = await guiToken.balanceOf(user1.address);
      await guiToken.connect(user1).faucet();
      const finalBalance = await guiToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance.add(FAUCET_AMOUNT));
    });

    it("Should enforce faucet cooldown", async function () {
      await guiToken.connect(user1).faucet();

      // Try to claim again immediately
      await expect(guiToken.connect(user1).faucet()).to.be.revertedWith("Faucet cooldown active");

      // Fast forward 24 hours
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      // Should be able to claim again
      await guiToken.connect(user1).faucet();
    });

    it("Should prevent faucet if balance too high", async function () {
      // Transfer tokens to exceed limit
      await guiToken.transfer(user1.address, ethers.utils.parseEther("250"));

      await expect(guiToken.connect(user1).faucet()).to.be.revertedWith("Balance too high for faucet");
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await guiToken.mint(user1.address, mintAmount);
      const balance = await guiToken.balanceOf(user1.address);
      expect(balance).to.equal(ethers.utils.parseEther("1050")); // 50 from faucet + 1000 minted
    });

    it("Should prevent non-owner from minting", async function () {
      await expect(
        guiToken.connect(user1).mint(user2.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("RumorVerification", function () {
    beforeEach(async function () {
      // Approve tokens for contract
      await guiToken.connect(user1).approve(rumorVerification.address, ethers.utils.parseEther("1000"));
      await guiToken.connect(user2).approve(rumorVerification.address, ethers.utils.parseEther("1000"));
      await guiToken.connect(user3).approve(rumorVerification.address, ethers.utils.parseEther("1000"));
      await guiToken.connect(user4).approve(rumorVerification.address, ethers.utils.parseEther("1000"));
    });

    it("Should submit rumor correctly", async function () {
      const content = "Bitcoin ETF approved by SEC";
      const tags = ["ETF", "Bitcoin", "SEC"];

      const tx = await rumorVerification.connect(user1).submitRumor(content, tags);
      const receipt = await tx.wait();

      // Check event
      const event = receipt.events.find(e => e.event === 'RumorSubmitted');
      expect(event.args.rumorId).to.equal(0);
      expect(event.args.submitter).to.equal(user1.address);
      expect(event.args.content).to.equal(content);
      expect(event.args.tags).to.deep.equal(tags);

      // Check rumor details
      const rumorDetails = await rumorVerification.getRumorDetails(0);
      expect(rumorDetails.submitter).to.equal(user1.address);
      expect(rumorDetails.content).to.equal(content);
      expect(rumorDetails.tags).to.deep.equal(tags);
      expect(rumorDetails.resolved).to.be.false;
    });

    it("Should require submission fee", async function () {
      const content = "Test rumor";
      const tags = ["Test"];

      const initialBalance = await guiToken.balanceOf(user1.address);
      await rumorVerification.connect(user1).submitRumor(content, tags);
      const finalBalance = await guiToken.balanceOf(user1.address);

      expect(finalBalance).to.equal(initialBalance.sub(SUBMISSION_FEE));
    });

    it("Should validate content length", async function () {
      const shortContent = "Short";
      const longContent = "A".repeat(501);
      const tags = ["Test"];

      await expect(
        rumorVerification.connect(user1).submitRumor(shortContent, tags)
      ).to.be.revertedWith("Invalid content length");

      await expect(
        rumorVerification.connect(user1).submitRumor(longContent, tags)
      ).to.be.revertedWith("Invalid content length");
    });

    it("Should validate tag count", async function () {
      const content = "Test rumor";
      const tooManyTags = ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"];

      await expect(
        rumorVerification.connect(user1).submitRumor(content, tooManyTags)
      ).to.be.revertedWith("Too many tags");
    });

    it("Should allow voting on rumors", async function () {
      // Submit rumor
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);

      // Vote true
      await rumorVerification.connect(user2).vote(0, true, MIN_STAKE);

      const rumorDetails = await rumorVerification.getRumorDetails(0);
      expect(rumorDetails.totalTrueVotes).to.equal(1);
      expect(rumorDetails.totalTrueStake).to.equal(MIN_STAKE);
    });

    it("Should prevent submitter from voting", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);

      await expect(
        rumorVerification.connect(user1).vote(0, true, MIN_STAKE)
      ).to.be.revertedWith("Submitter cannot vote");
    });

    it("Should prevent double voting", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);
      await rumorVerification.connect(user2).vote(0, true, MIN_STAKE);

      await expect(
        rumorVerification.connect(user2).vote(0, false, MIN_STAKE)
      ).to.be.revertedWith("Already voted");
    });

    it("Should enforce stake limits", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);

      // Too low stake
      await expect(
        rumorVerification.connect(user2).vote(0, true, ethers.utils.parseEther("0.5"))
      ).to.be.revertedWith("Invalid stake amount");

      // Too high stake
      await expect(
        rumorVerification.connect(user2).vote(0, true, ethers.utils.parseEther("10"))
      ).to.be.revertedWith("Invalid stake amount");
    });

    it("Should resolve rumors correctly", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // 24 hours
      await ethers.provider.send("evm_mine");

      await rumorVerification.connect(owner).resolveRumor(0, true);

      const rumorDetails = await rumorVerification.getRumorDetails(0);
      expect(rumorDetails.resolved).to.be.true;
      expect(rumorDetails.outcome).to.be.true;
      expect(rumorDetails.rewardPool).to.be.gt(0);
    });

    it("Should prevent premature resolution", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);

      await expect(
        rumorVerification.connect(owner).resolveRumor(0, true)
      ).to.be.revertedWith("Voting still active");
    });

    it("Should handle reward distribution correctly", async function () {
      // Submit rumor
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);

      // Vote true and false
      await rumorVerification.connect(user2).vote(0, true, MIN_STAKE);
      await rumorVerification.connect(user3).vote(0, false, MIN_STAKE);

      // Resolve as true
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await rumorVerification.connect(owner).resolveRumor(0, true);

      // Claim rewards
      const initialBalance = await guiToken.balanceOf(user2.address);
      await rumorVerification.connect(user2).claimRewards(0);
      const finalBalance = await guiToken.balanceOf(user2.address);

      // Should get stake back plus share of loser pool
      expect(finalBalance).to.be.gt(initialBalance.add(MIN_STAKE));
    });

    it("Should update reputation correctly", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);
      await rumorVerification.connect(user2).vote(0, true, MIN_STAKE);

      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await rumorVerification.connect(owner).resolveRumor(0, true);

      await rumorVerification.connect(user2).claimRewards(0);

      const stats = await rumorVerification.getUserStats(user2.address);
      expect(stats.reputation).to.equal(1);
      expect(stats.correctVotes).to.equal(1);
      expect(stats.totalVotes).to.equal(1);
    });

    it("Should prevent claiming rewards twice", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);
      await rumorVerification.connect(user2).vote(0, true, MIN_STAKE);

      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await rumorVerification.connect(owner).resolveRumor(0, true);

      await rumorVerification.connect(user2).claimRewards(0);

      await expect(
        rumorVerification.connect(user2).claimRewards(0)
      ).to.be.revertedWith("Already claimed");
    });

    it("Should support batch claiming", async function () {
      // Submit multiple rumors
      await rumorVerification.connect(user1).submitRumor("Rumor 1", ["Test"]);
      await rumorVerification.connect(user2).submitRumor("Rumor 2", ["Test"]);

      // Vote on both
      await rumorVerification.connect(user3).vote(0, true, MIN_STAKE);
      await rumorVerification.connect(user3).vote(1, false, MIN_STAKE);

      // Resolve both
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await rumorVerification.connect(owner).resolveRumor(0, true);
      await rumorVerification.connect(owner).resolveRumor(1, false);

      // Batch claim
      await rumorVerification.connect(user3).batchClaimRewards([0, 1]);

      const stats = await rumorVerification.getUserStats(user3.address);
      expect(stats.totalVotes).to.equal(2);
    });

    it("Should check if user can claim reward", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);
      await rumorVerification.connect(user2).vote(0, true, MIN_STAKE);

      // Before resolution
      expect(await rumorVerification.canClaimReward(0, user2.address)).to.be.false;

      // After resolution
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await rumorVerification.connect(owner).resolveRumor(0, true);

      expect(await rumorVerification.canClaimReward(0, user2.address)).to.be.true;

      // After claiming
      await rumorVerification.connect(user2).claimRewards(0);
      expect(await rumorVerification.canClaimReward(0, user2.address)).to.be.false;
    });

    it("Should get active rumors", async function () {
      await rumorVerification.connect(user1).submitRumor("Rumor 1", ["Test"]);
      await rumorVerification.connect(user2).submitRumor("Rumor 2", ["Test"]);

      const activeRumors = await rumorVerification.getActiveRumors();
      expect(activeRumors.length).to.equal(2);
      expect(activeRumors[0]).to.equal(0);
      expect(activeRumors[1]).to.equal(1);
    });

    it("Should get total rumors count", async function () {
      expect(await rumorVerification.getTotalRumors()).to.equal(0);

      await rumorVerification.connect(user1).submitRumor("Rumor 1", ["Test"]);
      expect(await rumorVerification.getTotalRumors()).to.equal(1);

      await rumorVerification.connect(user2).submitRumor("Rumor 2", ["Test"]);
      expect(await rumorVerification.getTotalRumors()).to.equal(2);
    });

    it("Should get rumor voters", async function () {
      await rumorVerification.connect(user1).submitRumor("Test rumor", ["Test"]);
      await rumorVerification.connect(user2).vote(0, true, MIN_STAKE);
      await rumorVerification.connect(user3).vote(0, false, MIN_STAKE);

      const voters = await rumorVerification.getRumorVoters(0);
      expect(voters.length).to.equal(2);
      expect(voters).to.include(user2.address);
      expect(voters).to.include(user3.address);
    });

    it("Should calculate accuracy correctly", async function () {
      // Submit and vote on multiple rumors
      await rumorVerification.connect(user1).submitRumor("Rumor 1", ["Test"]);
      await rumorVerification.connect(user2).submitRumor("Rumor 2", ["Test"]);
      await rumorVerification.connect(user3).submitRumor("Rumor 3", ["Test"]);

      // User4 votes correctly on all
      await rumorVerification.connect(user4).vote(0, true, MIN_STAKE);
      await rumorVerification.connect(user4).vote(1, false, MIN_STAKE);
      await rumorVerification.connect(user4).vote(2, true, MIN_STAKE);

      // Resolve all
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await rumorVerification.connect(owner).resolveRumor(0, true);
      await rumorVerification.connect(owner).resolveRumor(1, false);
      await rumorVerification.connect(owner).resolveRumor(2, true);

      // Claim all
      await rumorVerification.connect(user4).batchClaimRewards([0, 1, 2]);

      const stats = await rumorVerification.getUserStats(user4.address);
      expect(stats.totalVotes).to.equal(3);
      expect(stats.correctVotes).to.equal(3);
      expect(stats.accuracy).to.equal(10000); // 100% with 4 decimal places
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete rumor lifecycle", async function () {
      // 1. Submit rumor
      await rumorVerification.connect(user1).submitRumor("ETH 2.0 launch date announced", ["ETH", "Launch"]);

      // 2. Multiple users vote
      await rumorVerification.connect(user2).vote(0, true, ethers.utils.parseEther("2"));
      await rumorVerification.connect(user3).vote(0, false, ethers.utils.parseEther("3"));
      await rumorVerification.connect(user4).vote(0, true, ethers.utils.parseEther("1"));

      // 3. Verify voting state
      const rumorDetails = await rumorVerification.getRumorDetails(0);
      expect(rumorDetails.totalTrueVotes).to.equal(2);
      expect(rumorDetails.totalFalseVotes).to.equal(1);
      expect(rumorDetails.totalTrueStake).to.equal(ethers.utils.parseEther("3"));
      expect(rumorDetails.totalFalseStake).to.equal(ethers.utils.parseEther("3"));

      // 4. Resolve rumor
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await rumorVerification.connect(owner).resolveRumor(0, true);

      // 5. Claim rewards
      const initialBalance = await guiToken.balanceOf(user2.address);
      await rumorVerification.connect(user2).claimRewards(0);
      const finalBalance = await guiToken.balanceOf(user2.address);

      expect(finalBalance).to.be.gt(initialBalance);

      // 6. Check reputation and stats
      const stats = await rumorVerification.getUserStats(user2.address);
      expect(stats.reputation).to.equal(1);
      expect(stats.accuracy).to.be.gt(0);
    });
  });
});