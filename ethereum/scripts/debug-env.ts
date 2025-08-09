import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Debugging environment and network configuration...");
  
  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log("- PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
  console.log("- PRIVATE_KEY length:", process.env.PRIVATE_KEY?.length || 0);
  console.log("- SAPPHIRE_RPC_URL:", process.env.SAPPHIRE_RPC_URL);
  console.log("- SAPPHIRE_CHAIN_ID:", process.env.SAPPHIRE_CHAIN_ID);
  
  // Check network configuration
  console.log("\n🌐 Network Configuration:");
  try {
    const network = await ethers.provider.getNetwork();
    console.log("- Network:", network.name);
    console.log("- Chain ID:", network.chainId);
  } catch (error) {
    console.log("❌ Network connection failed:", error);
  }
  
  // Check signers
  console.log("\n👤 Signers:");
  try {
    const signers = await ethers.getSigners();
    console.log("- Number of signers:", signers.length);
    if (signers.length > 0) {
      console.log("- First signer address:", await signers[0].getAddress());
    } else {
      console.log("❌ No signers found!");
    }
  } catch (error) {
    console.log("❌ Signers error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  });
