import { useState, useEffect, useCallback } from 'react';
import { environmentalDataService, EnvironmentalData } from '../services/environmentalDataService';

export const useEnvironmentalData = () => {
  const [realTimeData, setRealTimeData] = useState<EnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'real' | 'simulated'>('simulated');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchRealData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await environmentalDataService.getRealTimeData();
      if (data) {
        setRealTimeData(data);
        setDataSource('real');
        setLastUpdate(new Date());
      } else {
        setDataSource('simulated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch environmental data');
      setDataSource('simulated');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchToSimulated = useCallback(() => {
    setDataSource('simulated');
    setRealTimeData(null);
    setLastUpdate(null);
  }, []);

  const switchToReal = useCallback(() => {
    fetchRealData();
  }, [fetchRealData]);

  const refreshData = useCallback(() => {
    if (dataSource === 'real') {
      fetchRealData();
    }
  }, [dataSource, fetchRealData]);

  // Auto-refresh every 30 seconds when using real data
  useEffect(() => {
    if (dataSource === 'real') {
      const interval = setInterval(fetchRealData, 30000);
      return () => clearInterval(interval);
    }
  }, [dataSource, fetchRealData]);

  // Check API status on mount
  useEffect(() => {
    const checkApiStatus = () => {
      const status = environmentalDataService.getApiKeyStatus();
      if (status.openWeather && status.iqAir) {
        setDataSource('real');
        fetchRealData();
      }
    };
    
    checkApiStatus();
  }, [fetchRealData]);

  return {
    realTimeData,
    isLoading,
    error,
    dataSource,
    lastUpdate,
    fetchRealData,
    switchToSimulated,
    switchToReal,
    refreshData,
    apiStatus: environmentalDataService.getApiKeyStatus()
  };
}; 