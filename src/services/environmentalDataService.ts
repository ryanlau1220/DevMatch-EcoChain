export interface EnvironmentalData {
  timestamp: number;
  airQuality: {
    pm25: number;
    pm10: number;
    co2: number;
    tvoc: number;
    aqi: number;
  };
  temperature: number;
  humidity: number;
  pressure: number;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  sensorId: string;
}

export interface AirQualityData {
  time: string;
  aqi: number;
  pm25: number;
  no2: number;
  timestamp: number;
}

export interface TemperatureData {
  date: string;
  temp: number;
  humidity: number;
  timestamp: number;
}

export interface WaterQualityData {
  time: string;
  ph: string;
  turbidity: number;
  dissolvedOxygen: string;
  timestamp: number;
}

class EnvironmentalDataService {
  private openWeatherApiKey: string | null = null;
  private iqAirApiKey: string | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Try to get API keys from environment variables first, then localStorage
    if (typeof window !== 'undefined') {
      // Check environment variables (VITE_ prefixed for Vite)
      const envOpenWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const envIqAirKey = import.meta.env.VITE_IQAIR_API_KEY;
      
      // Use environment variables if available, otherwise fall back to localStorage
      this.openWeatherApiKey = envOpenWeatherKey || localStorage.getItem('OPENWEATHER_API_KEY');
      this.iqAirApiKey = envIqAirKey || localStorage.getItem('IQAIR_API_KEY');
      
      if (!this.openWeatherApiKey || !this.iqAirKey) {
        console.warn('API keys not found. Please set VITE_OPENWEATHER_API_KEY and VITE_IQAIR_API_KEY in your .env file or in localStorage.');
      } else {
        console.log('✅ Environmental API keys loaded successfully');
        if (envOpenWeatherKey) console.log('OpenWeather API key loaded from environment variables');
        if (envIqAirKey) console.log('IQAir API key loaded from environment variables');
      }
    }
    
    this.isInitialized = true;
  }

  async fetchRealEnvironmentalData(): Promise<EnvironmentalData | null> {
    try {
      // Try to fetch from OpenWeather first (temperature, humidity, pressure)
      const weatherData = await this.fetchFromOpenWeather();
      
      // Try to fetch from IQAir (air quality data)
      const airQualityData = await this.fetchFromIQAir();
      
      if (weatherData && airQualityData) {
        // Combine both data sources
        return {
          timestamp: Date.now(),
          airQuality: {
            pm25: airQualityData.pm25,
            pm10: airQualityData.pm10,
            co2: 415.0, // Default value as IQAir doesn't provide CO2
            tvoc: 0.8,  // Default value as IQAir doesn't provide TVOC
            aqi: airQualityData.aqi
          },
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          location: {
            latitude: 3.1390, // Kuala Lumpur coordinates
            longitude: 101.6869,
            city: "Kuala Lumpur",
            country: "MY"
          },
          sensorId: `SENSOR_${Date.now()}`
        };
      } else if (weatherData) {
        // Only weather data available
        return {
          timestamp: Date.now(),
          airQuality: {
            pm25: 12.5,
            pm10: 25.3,
            co2: 415.0,
            tvoc: 0.8,
            aqi: 45
          },
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          location: {
            latitude: 3.1390,
            longitude: 101.6869,
            city: "Kuala Lumpur",
            country: "MY"
          },
          sensorId: `SENSOR_${Date.now()}`
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      return null;
    }
  }

  private async fetchFromOpenWeather(): Promise<{ temperature: number; humidity: number; pressure: number } | null> {
    if (!this.openWeatherApiKey) {
      console.warn('OpenWeather API key not available');
      return null;
    }

    try {
      const lat = 3.1390; // Kuala Lumpur
      const lon = 101.6869;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenWeather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        temperature: data.main?.temp || 22.5,
        humidity: data.main?.humidity || 65.0,
        pressure: data.main?.pressure || 1013.25
      };
    } catch (error) {
      console.error('Error fetching from OpenWeather:', error);
      return null;
    }
  }

  private async fetchFromIQAir(): Promise<{ pm25: number; pm10: number; aqi: number } | null> {
    if (!this.iqAirApiKey) {
      console.warn('IQAir API key not available');
      return null;
    }

    try {
      const url = `http://api.waqi.info/feed/@kuala-lumpur/?token=${this.iqAirApiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`IQAir API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        pm25: data.data?.iaqi?.pm25?.v || 12.5,
        pm10: data.data?.iaqi?.pm10?.v || 25.3,
        aqi: data.data?.aqi || 45
      };
    } catch (error) {
      console.error('Error fetching from IQAir:', error);
      return null;
    }
  }

  async generateHistoricalData(hours: number = 24): Promise<{
    airQuality: AirQualityData[];
    temperature: TemperatureData[];
    waterQuality: WaterQualityData[];
  }> {
    const now = Date.now();
    const baseTime = now;
    
    // Generate air quality data (last N hours)
    const airQuality = Array.from({ length: hours }, (_, i) => {
      const time = new Date(baseTime - (hours - 1 - i) * 60 * 60 * 1000);
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        aqi: Math.floor(Math.random() * 50) + 20, // 20-70 AQI
        pm25: Math.floor(Math.random() * 15) + 5, // 5-20 μg/m³
        no2: Math.floor(Math.random() * 30) + 10, // 10-40 ppb
        timestamp: time.getTime()
      };
    });

    // Generate temperature data (last 7 days)
    const temperature = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseTime - (6 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temp: Math.floor(Math.random() * 20) + 10, // 10-30°C
        humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
        timestamp: date.getTime()
      };
    });

    // Generate water quality data (last 12 hours)
    const waterQuality = Array.from({ length: 12 }, (_, i) => {
      const time = new Date(baseTime - (11 - i) * 2 * 60 * 60 * 1000);
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        ph: (Math.random() * 2 + 6.5).toFixed(1), // 6.5-8.5 pH
        turbidity: Math.floor(Math.random() * 10) + 2, // 2-12 NTU
        dissolvedOxygen: (Math.random() * 3 + 6).toFixed(1), // 6-9 mg/L
        timestamp: time.getTime()
      };
    });

    return { airQuality, temperature, waterQuality };
  }

  async getRealTimeData(): Promise<EnvironmentalData | null> {
    return this.fetchRealEnvironmentalData();
  }

  setApiKeys(openWeatherKey: string, iqAirKey: string) {
    this.openWeatherApiKey = openWeatherKey;
    this.iqAirApiKey = iqAirKey;
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('OPENWEATHER_API_KEY', openWeatherKey);
      localStorage.setItem('IQAIR_API_KEY', iqAirKey);
    }
  }

  getApiKeyStatus() {
    return {
      openWeather: !!this.openWeatherApiKey,
      iqAir: !!this.iqAirApiKey,
      isInitialized: this.isInitialized
    };
  }
}

export const environmentalDataService = new EnvironmentalDataService(); 