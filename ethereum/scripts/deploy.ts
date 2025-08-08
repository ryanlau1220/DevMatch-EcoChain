import { ethers } from "hardhat";

async function main() {
  console.log("Deploying EcoChain contracts...");

  // Deploy EnvironmentalMarket contract
  const EnvironmentalMarket = await ethers.getContractFactory("EnvironmentalMarket");
  const environmentalMarket = await EnvironmentalMarket.deploy();
  await environmentalMarket.waitForDeployment();
  const environmentalMarketAddress = await environmentalMarket.getAddress();
  console.log("EnvironmentalMarket deployed to:", environmentalMarketAddress);

  // Deploy OracleBridge contract
  const OracleBridge = await ethers.getContractFactory("OracleBridge");
  const oracleBridge = await OracleBridge.deploy();
  await oracleBridge.waitForDeployment();
  const oracleBridgeAddress = await oracleBridge.getAddress();
  console.log("OracleBridge deployed to:", oracleBridgeAddress);

  console.log("Deployment completed successfully!");
  console.log("Contract addresses:");
  console.log("- EnvironmentalMarket:", environmentalMarketAddress);
  console.log("- OracleBridge:", oracleBridgeAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 