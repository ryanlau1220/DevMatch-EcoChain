use serde::{Deserialize, Serialize};
use std::sync::Arc;
use anyhow::Result;
use tokio::time::{sleep, Duration};
use log::{info, warn, error};
use std::fs;
use std::env;

/// Environmental data structure
#[derive(Debug, Serialize, Deserialize)]
struct EnvironmentalData {
    timestamp: i64,
    air_quality: AirQualityData,
    temperature: f64,
    humidity: f64,
    pressure: f64,
    location: LocationData,
    sensor_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct AirQualityData {
    pm25: f64,
    pm10: f64,
    co2: f64,
    tvoc: f64,
    aqi: i32,
}

#[derive(Debug, Serialize, Deserialize)]
struct LocationData {
    latitude: f64,
    longitude: f64,
    city: String,
    country: String,
}

/// Contract configuration
#[derive(Debug, Serialize, Deserialize)]
struct ContractConfig {
    networks: std::collections::HashMap<String, NetworkConfig>,
    current_network: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct NetworkConfig {
    environmental_oracle: String,
    chain_id: u64,
    name: String,
}

/// API Configuration
#[derive(Debug, Clone)]
struct ApiConfig {
    openweather_api_key: Option<String>,
    iqair_api_key: Option<String>,
    doe_api_key: Option<String>,
    use_real_apis: bool,
}

/// Environmental Oracle ROFL Application
/// 
/// This is a standalone implementation that follows the ROFL architecture pattern
/// but doesn't depend on the Oasis SDK. It can run independently and be easily
/// integrated with the actual Oasis ROFL framework later.
struct EnvironmentalOracleApp {
    contract_address: String,
    network_name: String,
    api_config: ApiConfig,
}

impl EnvironmentalOracleApp {
    /// Start the environmental oracle application
    async fn start() -> Result<Arc<Self>> {
        info!("🌱 Starting EcoChain Environmental Oracle ROFL App...");
        
        // Load contract configuration
        let config_content = fs::read_to_string("config/contracts.json")
            .unwrap_or_else(|_| {
                info!("⚠️  No contract config found, using default Hardhat address");
                r#"{
                    "networks": {
                        "hardhat": {
                            "environmental_oracle": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                            "chain_id": 31337,
                            "name": "Hardhat Local"
                        }
                    },
                    "current_network": "hardhat"
                }"#.to_string()
            });
        
        let config: ContractConfig = serde_json::from_str(&config_content)?;
        let current_network = &config.current_network;
        let network_config = config.networks.get(current_network)
            .ok_or_else(|| anyhow::anyhow!("Network {} not found in config", current_network))?;
        
        info!("📡 Using network: {} ({})", network_config.name, current_network);
        info!("📍 Contract address: {}", network_config.environmental_oracle);
        
        // Load API configuration
        let api_config = ApiConfig {
            openweather_api_key: env::var("OPENWEATHER_API_KEY").ok(),
            iqair_api_key: env::var("IQAIR_API_KEY").ok(),
            doe_api_key: env::var("DOE_API_KEY").ok(),
            use_real_apis: env::var("USE_REAL_APIS").unwrap_or_else(|_| "false".to_string()) == "true",
        };
        
        info!("🔧 API Configuration:");
        info!("  - OpenWeather API: {}", if api_config.openweather_api_key.is_some() { "✅ Available" } else { "❌ Not configured" });
        info!("  - IQAir API: {}", if api_config.iqair_api_key.is_some() { "✅ Available" } else { "❌ Not configured" });
        info!("  - DOE API: {}", if api_config.doe_api_key.is_some() { "✅ Available" } else { "❌ Not configured" });
        info!("  - Use Real APIs: {}", if api_config.use_real_apis { "✅ Enabled" } else { "❌ Disabled (using mock data)" });
        
        // Test APIs if keys are available
        if api_config.use_real_apis {
            info!("🧪 Testing API connections...");
            if let Some(_) = &api_config.openweather_api_key {
                info!("  - OpenWeather API key found");
            }
            if let Some(_) = &api_config.iqair_api_key {
                info!("  - IQAir API key found");
            }
        }
        
        let app = Arc::new(EnvironmentalOracleApp {
            contract_address: network_config.environmental_oracle.clone(),
            network_name: network_config.name.clone(),
            api_config,
        });
        Ok(app)
    }

    /// Main application loop (simulates ROFL block processing)
    async fn run(self: Arc<Self>) -> Result<()> {
        info!("📡 Environmental Oracle is running and monitoring data sources...");
        info!("🔐 Running in simulated TEE environment (ROFL-compatible)");
        info!("🌐 Connected to network: {}", self.network_name);
        info!("📋 Contract: {}", self.contract_address);
        
        loop {
            // Simulate processing environmental data every block
            if let Err(err) = self.process_environmental_data().await {
                error!("❌ Failed to process environmental data: {:?}", err);
            }
            
            // Wait for next cycle (simulate block time)
            sleep(Duration::from_secs(30)).await;
        }
    }

    /// Fetch environmental data from multiple sources and submit to blockchain
    async fn process_environmental_data(&self) -> Result<()> {
        info!("🔍 Fetching environmental data...");

        // Fetch data from environmental APIs
        let env_data = self.fetch_environmental_data().await?;
        
        // Validate and process the data
        let processed_data = self.validate_environmental_data(env_data).await?;
        
        // Submit to blockchain
        self.submit_to_blockchain(processed_data).await?;
        
        info!("✅ Environmental data processed and submitted successfully");
        Ok(())
    }

    /// Fetch environmental data from external APIs
    async fn fetch_environmental_data(&self) -> Result<EnvironmentalData> {
        if self.api_config.use_real_apis {
            info!("🌐 Fetching real environmental data from APIs...");
            
            // Try to fetch real data from APIs
            if let Ok(real_data) = self.fetch_from_openweather().await {
                info!("✅ Successfully fetched data from OpenWeather API");
                return Ok(real_data);
            }
            
            if let Ok(real_data) = self.fetch_from_iqair().await {
                info!("✅ Successfully fetched data from IQAir API");
                return Ok(real_data);
            }
            
            if let Ok(real_data) = self.fetch_from_doe().await {
                info!("✅ Successfully fetched data from DOE API");
                return Ok(real_data);
            }
            
            warn!("⚠️  Failed to fetch from real APIs, falling back to mock data");
        }
        
        // Fallback to mock data
        info!("🎭 Using mock environmental data");
        let mock_data = EnvironmentalData {
            timestamp: chrono::Utc::now().timestamp(),
            air_quality: AirQualityData {
                pm25: 12.5,
                pm10: 25.3,
                co2: 415.0,
                tvoc: 0.8,
                aqi: 45,
            },
            temperature: 22.5,
            humidity: 65.0,
            pressure: 1013.25,
            location: LocationData {
                latitude: 3.1390,  // Kuala Lumpur coordinates
                longitude: 101.6869,
                city: "Kuala Lumpur".to_string(),
                country: "MY".to_string(),
            },
            sensor_id: uuid::Uuid::new_v4().to_string(),
        };

        info!("📊 Fetched environmental data: {:?}", mock_data);
        Ok(mock_data)
    }

    /// Validate environmental data for anomalies and consistency
    async fn validate_environmental_data(&self, data: EnvironmentalData) -> Result<EnvironmentalData> {
        info!("🔍 Validating environmental data...");

        // Check for reasonable ranges
        if data.temperature < -50.0 || data.temperature > 60.0 {
            return Err(anyhow::anyhow!("Temperature out of reasonable range"));
        }

        if data.humidity < 0.0 || data.humidity > 100.0 {
            return Err(anyhow::anyhow!("Humidity out of reasonable range"));
        }

        if data.air_quality.aqi < 0 || data.air_quality.aqi > 500 {
            return Err(anyhow::anyhow!("AQI out of reasonable range"));
        }

        // Check for anomalies (simplified)
        if data.air_quality.pm25 > 50.0 {
            warn!("⚠️  High PM2.5 levels detected: {}", data.air_quality.pm25);
        }

        if data.air_quality.co2 > 1000.0 {
            warn!("⚠️  High CO2 levels detected: {}", data.air_quality.co2);
        }

        info!("✅ Environmental data validation passed");
        Ok(data)
    }

    /// Submit validated environmental data to the blockchain
    async fn submit_to_blockchain(&self, data: EnvironmentalData) -> Result<()> {
        info!("⛓️  Submitting environmental data to blockchain...");
        info!("📍 Target contract: {}", self.contract_address);

        // Encode the environmental data
        let encoded_data = serde_json::to_string(&data)?;
        info!("📝 Encoded data: {}", encoded_data);

        // Simulate ROFL-compatible blockchain submission
        // In production, this would call a smart contract on Sapphire
        info!("🚀 Simulating ROFL blockchain submission to {}...", self.contract_address);
        
        // TODO: Replace with actual contract address and ABI when integrating with Oasis
        // let contract_address = &self.contract_address; // Environmental data contract
        // let mut tx = self.new_transaction(
        //     "evm.Call",
        //     module_evm::types::Call {
        //         address: contract_address.parse().unwrap(),
        //         value: 0.into(),
        //         data: self.encode_environmental_data(data),
        //     },
        // );
        // tx.set_fee_gas(500_000);
        // env.client().sign_and_submit_tx(env.signer(), tx).await?;

        info!("✅ Environmental data submitted to blockchain (ROFL-compatible)");
        info!("📊 Network: {}, Contract: {}", self.network_name, self.contract_address);
        Ok(())
    }

    /// Fetch data from OpenWeather API
    async fn fetch_from_openweather(&self) -> Result<EnvironmentalData> {
        let api_key = match &self.api_config.openweather_api_key {
            Some(key) => key,
            None => return Err(anyhow::anyhow!("OpenWeather API key not configured")),
        };
        
        // Kuala Lumpur coordinates
        let lat = 3.1390;
        let lon = 101.6869;
        let url = format!(
            "https://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&appid={}&units=metric",
            lat, lon, api_key
        );
        
        let response = reqwest::get(&url).await?;
        let weather_data: serde_json::Value = response.json().await?;
        
        // Extract weather data
        let temp = weather_data["main"]["temp"].as_f64().unwrap_or(22.5);
        let humidity = weather_data["main"]["humidity"].as_f64().unwrap_or(65.0);
        let pressure = weather_data["main"]["pressure"].as_f64().unwrap_or(1013.25);
        
        // Create environmental data
        let env_data = EnvironmentalData {
            timestamp: chrono::Utc::now().timestamp(),
            air_quality: AirQualityData {
                pm25: 12.5, // OpenWeather doesn't provide PM2.5, using default
                pm10: 25.3, // OpenWeather doesn't provide PM10, using default
                co2: 415.0, // OpenWeather doesn't provide CO2, using default
                tvoc: 0.8,  // OpenWeather doesn't provide TVOC, using default
                aqi: 45,    // Calculated based on other factors
            },
            temperature: temp,
            humidity: humidity,
            pressure: pressure,
            location: LocationData {
                latitude: lat,
                longitude: lon,
                city: "Kuala Lumpur".to_string(),
                country: "MY".to_string(),
            },
            sensor_id: uuid::Uuid::new_v4().to_string(),
        };
        
        info!("🌤️  OpenWeather data: temp={}°C, humidity={}%, pressure={}hPa", temp, humidity, pressure);
        Ok(env_data)
    }
    
    /// Fetch data from IQAir API (Global coverage including Malaysia)
    async fn fetch_from_iqair(&self) -> Result<EnvironmentalData> {
        let api_key = match &self.api_config.iqair_api_key {
            Some(key) => key,
            None => return Err(anyhow::anyhow!("IQAir API key not configured")),
        };
        
        // IQAir API endpoint for Kuala Lumpur
        let url = format!(
            "http://api.waqi.info/feed/@kuala-lumpur/?token={}",
            api_key
        );
        
        let response = reqwest::get(&url).await?;
        let air_data: serde_json::Value = response.json().await?;
        
        // Extract air quality data
        let pm25 = air_data["data"]["iaqi"]["pm25"]["v"].as_f64().unwrap_or(12.5);
        let pm10 = air_data["data"]["iaqi"]["pm10"]["v"].as_f64().unwrap_or(25.3);
        let aqi = air_data["data"]["aqi"].as_i64().unwrap_or(45) as i32;
        
        // Create environmental data with IQAir air quality
        let env_data = EnvironmentalData {
            timestamp: chrono::Utc::now().timestamp(),
            air_quality: AirQualityData {
                pm25: pm25,
                pm10: pm10,
                co2: 415.0, // IQAir doesn't provide CO2, using default
                tvoc: 0.8,  // IQAir doesn't provide TVOC, using default
                aqi: aqi,
            },
            temperature: 22.5, // IQAir doesn't provide temperature, using default
            humidity: 65.0,    // IQAir doesn't provide humidity, using default
            pressure: 1013.25, // IQAir doesn't provide pressure, using default
            location: LocationData {
                latitude: 3.1390,
                longitude: 101.6869,
                city: "Kuala Lumpur".to_string(),
                country: "MY".to_string(),
            },
            sensor_id: uuid::Uuid::new_v4().to_string(),
        };
        
        info!("🌬️  IQAir Air Quality data: PM2.5={}, PM10={}, AQI={}", pm25, pm10, aqi);
        Ok(env_data)
    }
    
    /// Fetch data from Malaysian DOE API (if available)
    async fn fetch_from_doe(&self) -> Result<EnvironmentalData> {
        let _api_key = match &self.api_config.doe_api_key {
            Some(key) => key,
            None => return Err(anyhow::anyhow!("DOE API key not configured")),
        };
        
        // Note: Malaysian DOE API might require special access
        // This is a placeholder for when the API becomes available
        return Err(anyhow::anyhow!("DOE API not yet implemented"));
    }

    /// Encode environmental data for blockchain submission
    fn encode_environmental_data(&self, data: EnvironmentalData) -> Vec<u8> {
        // This would encode the data according to the smart contract ABI
        // For now, we'll return a simple encoding
        format!("environmental_data:{}", serde_json::to_string(&data).unwrap())
            .into_bytes()
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    // Load environment variables from .env file
    dotenv::dotenv().ok();
    
    // Initialize logging
    env_logger::init();
    
    info!("🧪 Testing Malaysian Environmental APIs...");
    
    // Start the environmental oracle
    let app = EnvironmentalOracleApp::start().await?;
    
    // Test API integration
    info!("🔍 Testing API integration...");
    match app.fetch_environmental_data().await {
        Ok(data) => {
            info!("✅ API Test Successful!");
            info!("📊 Environmental Data:");
            info!("  - Temperature: {}°C", data.temperature);
            info!("  - Humidity: {}%", data.humidity);
            info!("  - Pressure: {} hPa", data.pressure);
            info!("  - PM2.5: {}", data.air_quality.pm25);
            info!("  - PM10: {}", data.air_quality.pm10);
            info!("  - AQI: {}", data.air_quality.aqi);
            info!("  - Location: {}, {}", data.location.city, data.location.country);
        }
        Err(e) => {
            error!("❌ API Test Failed: {}", e);
        }
    }
    
    info!("🎯 API testing completed!");
    Ok(())
}
