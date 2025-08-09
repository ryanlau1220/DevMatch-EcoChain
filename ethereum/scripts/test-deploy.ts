import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing Sapphire deployment...");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer address:", await deployer.getAddress());
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);
  
  // Get balance
  const balance = await ethers.provider.getBalance(await deployer.getAddress());
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  // Try to get contract factory
  console.log("📦 Getting contract factory...");
  const EnvironmentalOracle = await ethers.getContractFactory("EnvironmentalOracle");
  console.log("✅ Contract factory created successfully");
  
  console.log("🎯 Ready for deployment!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
