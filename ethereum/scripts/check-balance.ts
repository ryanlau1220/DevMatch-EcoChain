import { ethers } from "hardhat";

async function main() {
  console.log("💰 Checking wallet balance on Sapphire testnet...");

  // Get signers
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log("👤 Wallet address:", address);
  
  // Get balance
  const balance = await ethers.provider.getBalance(address);
  const balanceInEth = ethers.formatEther(balance);
  console.log("💰 Balance:", balanceInEth, "ETH");
  
  // Check if balance is sufficient
  const minBalance = ethers.parseEther("0.01"); // 0.01 ETH minimum
  if (balance < minBalance) {
    console.log("❌ Insufficient balance for deployment");
    console.log("📋 Please get test tokens from: https://faucet.testnet.oasis.dev/");
    console.log("📋 Enter your address:", address);
  } else {
    console.log("✅ Sufficient balance for deployment!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Check failed:", error);
    process.exit(1);
  });
