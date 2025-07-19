const { ethers, network } = require("hardhat");

async function main() {
  console.log("🚀 Starting CryptoTruth contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Get balance using provider (updated syntax)
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy GUI Token first
  console.log("\n🪙 Deploying GUI Token...");
  const GUIToken = await ethers.getContractFactory("GUIToken");
  const guiToken = await GUIToken.deploy();
  await guiToken.waitForDeployment(); // Updated from .deployed()
  const guiTokenAddress = await guiToken.getAddress(); // Updated from .address
  console.log("✅ GUI Token deployed to:", guiTokenAddress);

  // Deploy RumorVerification contract
  console.log("\n🔍 Deploying RumorVerification contract...");
  const RumorVerification = await ethers.getContractFactory("RumorVerification");
  const rumorVerification = await RumorVerification.deploy(guiTokenAddress);
  await rumorVerification.waitForDeployment(); // Updated from .deployed()
  const rumorVerificationAddress = await rumorVerification.getAddress(); // Updated from .address
  console.log("✅ RumorVerification deployed to:", rumorVerificationAddress);

  // Verify deployments
  console.log("\n🔍 Verifying deployments...");

  const guiTokenCode = await ethers.provider.getCode(guiTokenAddress);
  const rumorVerificationCode = await ethers.provider.getCode(rumorVerificationAddress);

  if (guiTokenCode === "0x") {
    throw new Error("GUI Token deployment failed");
  }
  if (rumorVerificationCode === "0x") {
    throw new Error("RumorVerification deployment failed");
  }

  console.log("✅ Both contracts deployed successfully!");

  // Get initial token balance
  const deployerBalance = await guiToken.balanceOf(deployer.address);
  console.log("💰 Deployer GUI balance:", ethers.formatEther(deployerBalance), "GUI"); // Updated from ethers.utils.formatEther

  // Test faucet functionality
  console.log("\n🧪 Testing faucet functionality...");
  const testAccount = ethers.Wallet.createRandom().connect(ethers.provider); // Updated from ethers.utils.randomBytes

  // Fund test account with some ETH for gas
  const fundTx = await deployer.sendTransaction({
    to: testAccount.address,
    value: ethers.parseEther("0.001") // Lowered from 0.1 ETH to 0.001 ETH
  });
  await fundTx.wait();

  // Test faucet
  const faucetTx = await guiToken.connect(testAccount).faucet();
  await faucetTx.wait();

  const testBalance = await guiToken.balanceOf(testAccount.address);
  console.log("✅ Faucet test successful! Test account balance:", ethers.formatEther(testBalance), "GUI");

  // Check and approve GUI tokens for rumor submission
  const submissionFee = ethers.parseEther("10"); // 10 GUI, matches SUBMISSION_FEE in contract
  const allowanceBefore = await guiToken.allowance(testAccount.address, rumorVerificationAddress);
  console.log("Allowance before approve:", ethers.formatEther(allowanceBefore));

  const approveTx = await guiToken.connect(testAccount).approve(rumorVerificationAddress, ethers.parseEther("100"));
  await approveTx.wait();

  const allowanceAfter = await guiToken.allowance(testAccount.address, rumorVerificationAddress);
  console.log("Allowance after approve:", ethers.formatEther(allowanceAfter));

  // Test rumor submission
  console.log("\n🧪 Testing rumor submission...");
  const submitTx = await rumorVerification.connect(testAccount).submitRumor(
    "Test rumor for deployment verification",
    ["Test", "Deployment"]
  );
  const submitReceipt = await submitTx.wait();

  // Check for RumorSubmitted event (updated event handling)
  const rumorSubmittedEvent = submitReceipt.logs.find(log => {
    try {
      const parsed = rumorVerification.interface.parseLog(log);
      return parsed.name === 'RumorSubmitted';
    } catch (e) {
      return false;
    }
  });

  if (rumorSubmittedEvent) {
    const parsed = rumorVerification.interface.parseLog(rumorSubmittedEvent);
    console.log("✅ Rumor submission test successful! Rumor ID:", parsed.args.rumorId.toString());
  } else {
    console.log("⚠️  Warning: RumorSubmitted event not found");
  }

  // Test contract interactions
  console.log("\n🧪 Testing contract interactions...");

  // Get rumor details
  const rumorDetails = await rumorVerification.getRumorDetails(0);
  console.log("📋 Rumor details retrieved successfully");
  console.log("   - Submitter:", rumorDetails.submitter);
  console.log("   - Content:", rumorDetails.content);
  console.log("   - Tags:", rumorDetails.tags.join(", "));
  console.log("   - Created at:", new Date(Number(rumorDetails.createdAt) * 1000).toISOString());

  // Get total rumors
  const totalRumors = await rumorVerification.getTotalRumors();
  console.log("📊 Total rumors:", totalRumors.toString());

  // Get active rumors
  const activeRumors = await rumorVerification.getActiveRumors();
  console.log("🔄 Active rumors:", activeRumors.length);

  // Display deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);
  console.log("GUI Token:", guiTokenAddress);
  console.log("RumorVerification:", rumorVerificationAddress);
  console.log("Chain ID:", network.config.chainId);
  console.log("=".repeat(60));

  // Save deployment addresses to file
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    guiToken: guiTokenAddress,
    rumorVerification: rumorVerificationAddress,
    deploymentTime: new Date().toISOString(),
    chainId: network.config.chainId,
    testResults: {
      faucetWorking: true,
      rumorSubmissionWorking: true,
      totalRumors: totalRumors.toString(),
      activeRumors: activeRumors.length
    }
  };

  const fs = require('fs');
  fs.writeFileSync(
    `deployment-${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("📄 Deployment info saved to deployment-" + network.name + ".json");

  // Instructions for next steps
  console.log("\n📋 Next Steps:");
  console.log("1. Update frontend .env with contract addresses:");
  console.log(`   VITE_GUI_TOKEN_ADDRESS=${guiTokenAddress}`);
  console.log(`   VITE_VERIFICATION_CONTRACT_ADDRESS=${rumorVerificationAddress}`);
  console.log("2. Update backend .env with contract addresses");
  console.log("3. Verify contracts on Etherscan (if on testnet/mainnet)");
  console.log("4. Test the complete flow on frontend");
  console.log("5. Set up monitoring and analytics");

  // Verification instructions
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n🔍 Contract Verification Commands:");
    console.log(`npx hardhat verify --network ${network.name} ${guiTokenAddress}`);
    console.log(`npx hardhat verify --network ${network.name} ${rumorVerificationAddress} "${guiTokenAddress}"`);
  }

  return {
    guiToken: guiTokenAddress,
    rumorVerification: rumorVerificationAddress,
    deploymentInfo
  };
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });