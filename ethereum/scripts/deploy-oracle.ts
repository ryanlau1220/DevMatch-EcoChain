import { ethers } from "hardhat";

async function main() {
  console.log("🌱 Deploying EcoChain Environmental Oracle contract...");

  // Get the contract factory
  const EnvironmentalOracle = await ethers.getContractFactory("EnvironmentalOracle");
  
  // Deploy the contract
  const environmentalOracle = await EnvironmentalOracle.deploy();
  await environmentalOracle.waitForDeployment();
  const environmentalOracleAddress = await environmentalOracle.getAddress();
  
  console.log("✅ EnvironmentalOracle deployed successfully!");
  console.log("📍 Contract address:", environmentalOracleAddress);
  
  // Get deployer address
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("👤 Deployed by:", deployerAddress);
  
  // Authorize the deployer as an oracle
  console.log("🔐 Authorizing deployer as oracle...");
  const authorizeTx = await environmentalOracle.authorizeOracle(
    deployerAddress,
    "EcoChain Environmental Oracle"
  );
  await authorizeTx.wait();
  console.log("✅ Deployer authorized as oracle");
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  const blockNumber = await ethers.provider.getBlockNumber();
  
  console.log("\n🎯 Deployment Summary:");
  console.log("Contract: EnvironmentalOracle");
  console.log("Address:", environmentalOracleAddress);
  console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("Block Number:", blockNumber);
  
  console.log("\n📋 Next Steps:");
  console.log("1. Update ROFL application with contract address");
  console.log("2. Test data submission from ROFL to contract");
  console.log("3. Monitor contract events for data submissions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
