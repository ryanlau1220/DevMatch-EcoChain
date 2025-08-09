import { ethers } from "hardhat";

async function main() {
  console.log("🌱 Testing EcoChain Environmental Data Submission...");

  // Get the deployed contract
  const contractAddress = "0x2CA22FCA74ABD51cCD166845a13E2064390605aC";
  const EnvironmentalOracle = await ethers.getContractFactory("EnvironmentalOracle");
  const environmentalOracle = EnvironmentalOracle.attach(contractAddress);

  // Get the signer
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  console.log("👤 Testing with address:", deployerAddress);
  console.log("📍 Contract address:", contractAddress);

  try {
    // Test 1: Submit environmental data
    console.log("\n📊 Submitting environmental data...");
    const submitTx = await environmentalOracle.submitEnvironmentalData(
      Math.floor(Date.now() / 1000), // timestamp
      2500, // temperature (25.00°C * 100)
      6000, // humidity (60.00% * 100)
      101300, // pressure (1013.00 hPa * 100)
      250, // pm25 (2.50 μg/m³ * 100)
      500, // pm10 (5.00 μg/m³ * 100)
      40000, // co2 (400.00 ppm * 100)
      5000, // tvoc (50.00 ppb * 100)
      45, // aqi (45 AQI)
      '{"lat": 40.7128, "lng": -74.0060, "city": "New York", "country": "USA"}', // location JSON
      "ECOCHAIN_SENSOR_001" // sensor ID
    );
    
    console.log("⏳ Waiting for transaction confirmation...");
    const receipt = await submitTx.wait();
    console.log("✅ Environmental data submitted successfully!");
    console.log("📝 Transaction hash:", receipt?.hash);
    console.log("📊 Gas used:", receipt?.gasUsed?.toString());

    console.log("\n🎯 Test completed successfully!");
    console.log("📋 Check your subgraph at: https://thegraph.com/studio/subgraph/ecochain-environmental-data");
    console.log("🔍 Look for this event in the 'Indexing' tab:");
    console.log("   - EnvironmentalDataSubmitted");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }); 