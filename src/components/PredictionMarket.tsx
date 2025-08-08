import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Market {
  id: number;
  question: string;
  description: string;
  endTime: number;
  totalLiquidity: number;
  resolved: boolean;
  outcome?: boolean;
  creator: string;
  yesShares: number;
  noShares: number;
}

interface Position {
  yesShares: number;
  noShares: number;
}

const PredictionMarket: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [userPositions, setUserPositions] = useState<{ [key: number]: Position }>({});
  const [showCreateMarket, setShowCreateMarket] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeOutcome, setTradeOutcome] = useState<boolean>(true);
  const [tradeShares, setTradeShares] = useState<number>(0);
  const [tradeAmount, setTradeAmount] = useState<number>(0);

  // Form state for creating markets
  const [newMarket, setNewMarket] = useState({
    question: '',
    description: '',
    duration: 86400, // 24 hours in seconds
    liquidity: 0.1
  });

  // Load data from localStorage or use mock data
  useEffect(() => {
    const savedMarkets = localStorage.getItem('ecochain-markets');
    const savedPositions = localStorage.getItem('ecochain-positions');
    
    if (savedMarkets) {
      setMarkets(JSON.parse(savedMarkets));
    } else {
      // Initial mock data
      const mockMarkets: Market[] = [
        {
          id: 1,
          question: "Will the air quality index exceed 150 in downtown this week?",
          description: "Prediction market for air quality monitoring in the central business district",
          endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
          totalLiquidity: 2.5,
          resolved: false,
          creator: "0x1234...5678",
          yesShares: 1.2,
          noShares: 1.3
        },
        {
          id: 2,
          question: "Will the average temperature be above 25°C next month?",
          description: "Temperature prediction for the upcoming month based on sensor data",
          endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
          totalLiquidity: 1.8,
          resolved: false,
          creator: "0x8765...4321",
          yesShares: 0.9,
          noShares: 0.9
        },
        {
          id: 3,
          question: "Will water quality parameters meet EPA standards this quarter?",
          description: "Water quality assessment based on local sensor network data",
          endTime: Date.now() + 90 * 24 * 60 * 60 * 1000,
          totalLiquidity: 3.2,
          resolved: false,
          creator: "0xabcd...efgh",
          yesShares: 1.6,
          noShares: 1.6
        }
      ];
      setMarkets(mockMarkets);
      localStorage.setItem('ecochain-markets', JSON.stringify(mockMarkets));
    }

    if (savedPositions) {
      setUserPositions(JSON.parse(savedPositions));
    }
  }, []);

  const createMarket = () => {
    if (!newMarket.question || !newMarket.description) return;

    const market: Market = {
      id: markets.length + 1,
      question: newMarket.question,
      description: newMarket.description,
      endTime: Date.now() + newMarket.duration * 1000,
      totalLiquidity: newMarket.liquidity,
      resolved: false,
      creator: "0x1234...5678", // Mock address
      yesShares: newMarket.liquidity / 2,
      noShares: newMarket.liquidity / 2
    };

    const updatedMarkets = [...markets, market];
    setMarkets(updatedMarkets);
    localStorage.setItem('ecochain-markets', JSON.stringify(updatedMarkets));
    setShowCreateMarket(false);
    setNewMarket({ question: '', description: '', duration: 86400, liquidity: 0.1 });
  };

  const calculateProbability = (yesShares: number, noShares: number) => {
    const total = yesShares + noShares;
    return total > 0 ? (yesShares / total) * 100 : 50;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const executeTrade = () => {
    if (!selectedMarket || tradeShares <= 0 || tradeAmount <= 0) return;

    // Mock trade execution
    const currentPosition = userPositions[selectedMarket.id] || { yesShares: 0, noShares: 0 };
    
    if (tradeOutcome) {
      currentPosition.yesShares += tradeShares;
    } else {
      currentPosition.noShares += tradeShares;
    }

    const updatedPositions = {
      ...userPositions,
      [selectedMarket.id]: currentPosition
    };
    setUserPositions(updatedPositions);
    localStorage.setItem('ecochain-positions', JSON.stringify(updatedPositions));

    setShowTradeModal(false);
    setTradeShares(0);
    setTradeAmount(0);
  };

  const getMarketStatus = (market: Market) => {
    if (market.resolved) {
      return market.outcome ? 'Resolved: YES' : 'Resolved: NO';
    }
    return Date.now() > market.endTime ? 'Ended' : 'Active';
  };

  const getStatusColor = (market: Market) => {
    if (market.resolved) return 'text-green-600';
    if (Date.now() > market.endTime) return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Environmental Prediction Markets</h1>
          <p className="text-gray-600">Trade on environmental outcomes using verified sensor data</p>
        </div>

        {/* Create Market Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateMarket(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create New Market
          </button>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {markets.map((market) => (
            <div
              key={market.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {market.question}
                </h3>
                <span className={`text-sm font-medium ${getStatusColor(market)}`}>
                  {getMarketStatus(market)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {market.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Liquidity:</span>
                  <span className="font-medium">{market.totalLiquidity} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ends:</span>
                  <span className="font-medium">{formatTime(market.endTime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Creator:</span>
                  <span className="font-medium">{market.creator}</span>
                </div>
              </div>

              {/* Probability Display */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-600 font-medium">YES</span>
                  <span className="text-red-600 font-medium">NO</span>
                </div>
                <div className="flex bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProbability(market.yesShares, market.noShares)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{calculateProbability(market.yesShares, market.noShares).toFixed(1)}%</span>
                  <span>{(100 - calculateProbability(market.yesShares, market.noShares)).toFixed(1)}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedMarket(market);
                    setShowTradeModal(true);
                  }}
                  disabled={market.resolved || Date.now() > market.endTime}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Trade
                </button>
                <button
                  onClick={() => setSelectedMarket(market)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Market Modal */}
        {showCreateMarket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Market</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newMarket.question}
                    onChange={(e) => setNewMarket({...newMarket, question: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Will air quality exceed 150 this week?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newMarket.description}
                    onChange={(e) => setNewMarket({...newMarket, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Detailed description of the market..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={newMarket.duration / 86400}
                    onChange={(e) => setNewMarket({...newMarket, duration: parseInt(e.target.value) * 86400})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    max="365"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Liquidity (ETH)
                  </label>
                  <input
                    type="number"
                    value={newMarket.liquidity}
                    onChange={(e) => setNewMarket({...newMarket, liquidity: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={createMarket}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Create Market
                </button>
                <button
                  onClick={() => setShowCreateMarket(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trade Modal */}
        {showTradeModal && selectedMarket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Trade Shares</h2>
              <p className="text-gray-600 mb-4">{selectedMarket.question}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outcome
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTradeOutcome(true)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        tradeOutcome 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      YES
                    </button>
                    <button
                      onClick={() => setTradeOutcome(false)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        !tradeOutcome 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    value={tradeShares}
                    onChange={(e) => setTradeShares(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0.01"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost (ETH)
                  </label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0.001"
                    step="0.001"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={executeTrade}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Execute Trade
                </button>
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Market Details Modal */}
        {selectedMarket && !showTradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Market Details</h2>
                <button
                  onClick={() => setSelectedMarket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Question</h3>
                  <p className="text-gray-700">{selectedMarket.question}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedMarket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Market Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Liquidity:</span>
                        <span className="font-medium">{selectedMarket.totalLiquidity} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">YES Shares:</span>
                        <span className="font-medium">{selectedMarket.yesShares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">NO Shares:</span>
                        <span className="font-medium">{selectedMarket.noShares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">YES Probability:</span>
                        <span className="font-medium">
                          {calculateProbability(selectedMarket.yesShares, selectedMarket.noShares).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Your Position</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">YES Shares:</span>
                        <span className="font-medium">
                          {userPositions[selectedMarket.id]?.yesShares || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">NO Shares:</span>
                        <span className="font-medium">
                          {userPositions[selectedMarket.id]?.noShares || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Price History</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { time: 'Day 1', yesPrice: 0.5, noPrice: 0.5 },
                        { time: 'Day 2', yesPrice: 0.52, noPrice: 0.48 },
                        { time: 'Day 3', yesPrice: 0.48, noPrice: 0.52 },
                        { time: 'Day 4', yesPrice: 0.55, noPrice: 0.45 },
                        { time: 'Day 5', yesPrice: 0.53, noPrice: 0.47 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="yesPrice" stroke="#10B981" name="YES Price" />
                        <Line type="monotone" dataKey="noPrice" stroke="#EF4444" name="NO Price" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionMarket; 