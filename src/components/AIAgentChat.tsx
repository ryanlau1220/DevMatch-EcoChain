import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiSettings, FiTrendingUp, FiAward, FiZap } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { aiService, AIResponse } from '../services/aiService';

// Types
interface AIAgent {
  id: string;
  name: string;
  specialization: string;
  knowledge_areas: string[];
  personality_traits: string[];
  trading_strategy: string;
  created_at: number;
  last_active: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  confidence_score?: number;
  suggestions?: string[];
  provider?: 'gemini' | 'mock';
  providerInfo?: string;
  data_visualization?: {
    type: 'chart' | 'metric' | 'alert';
    data: any;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  action: string;
}

// Unified AI Agent
const unifiedAgent: AIAgent = {
  id: 'unified',
  name: 'EcoChain AI Assistant',
  specialization: 'Multi-Domain Environmental Intelligence',
  knowledge_areas: [
    'Environmental Data Analysis',
    'Prediction Market Trading',
    'DePIN Network Monitoring',
    'Carbon Credit Analysis',
    'Cross-Chain Data Validation',
    'Sustainability Metrics'
  ],
  personality_traits: ['Analytical', 'Adaptive', 'Comprehensive'],
  trading_strategy: 'Multi-domain environmental intelligence with cross-chain validation',
  created_at: Date.now() - 86400000 * 90,
  last_active: Date.now() - 300000
};

// Quick Actions for enhanced user experience
const quickActions: QuickAction[] = [
  {
    id: 'air-quality',
    label: 'Air Quality Analysis',
    icon: '🌬️',
    description: 'Get current air quality insights and trends',
    action: 'Analyze current air quality data and provide recommendations'
  },
  {
    id: 'carbon-market',
    label: 'Carbon Market Update',
    icon: '🌱',
    description: 'Latest carbon credit market analysis',
    action: 'Provide current carbon market trends and trading opportunities'
  },
  {
    id: 'network-health',
    label: 'Network Status',
    icon: '📡',
    description: 'Check DePIN network health and sensor status',
    action: 'Analyze network performance and identify maintenance needs'
  },
  {
    id: 'prediction-markets',
    label: 'Market Predictions',
    icon: '📈',
    description: 'Environmental prediction market insights',
    action: 'Analyze prediction markets and provide trading recommendations'
  },
  {
    id: 'sustainability-report',
    label: 'Sustainability Report',
    icon: '📊',
    description: 'Generate comprehensive sustainability analysis',
    action: 'Create a detailed sustainability report with metrics and recommendations'
  },
  {
    id: 'weather-impact',
    label: 'Weather Impact',
    icon: '🌤️',
    description: 'Weather effects on environmental data',
    action: 'Analyze weather patterns and their impact on environmental metrics'
  }
];

const AIAgentChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [selectedQuickAction, setSelectedQuickAction] = useState<QuickAction | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const savedMessages = localStorage.getItem('ecochain-chat-unified');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      // Convert timestamp strings back to Date objects
      const messagesWithDates = parsedMessages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));
      setMessages(messagesWithDates);
    } else {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'agent',
        content: `Hello! I'm ${unifiedAgent.name}, your ${unifiedAgent.specialization}. I can help you with environmental data analysis, prediction markets, network monitoring, carbon credits, and more. How can I assist you today?`,
        timestamp: new Date(),
        confidence_score: 100
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ecochain-chat-unified', JSON.stringify(messages));
    }
  }, [messages]);

    const generateAIResponse = async (userInput: string): Promise<AIResponse> => {
    try {
      // Get conversation context for better responses
      const context = messages.slice(-3).map(msg => `${msg.type}: ${msg.content}`).join('\n');
      
      // Use the AI service to generate response
      const response = await aiService.generateResponse(userInput, context);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      
             // Fallback to mock response
       return {
         content: `I apologize, but I'm experiencing technical difficulties. As your ${unifiedAgent.specialization}, I can help you with environmental data analysis, prediction markets, network monitoring, carbon credits, and more. Please try again or ask me about a specific environmental topic.`,
         confidence: 75,
         suggestions: ['Analyze current environmental trends', 'Show me prediction market opportunities', 'Generate a sustainability report'],
         provider: 'mock',
         providerInfo: 'Error Fallback - Technical difficulties'
       };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Generate AI response using the service
      const aiResponse = await generateAIResponse(inputMessage);
      
             const response: ChatMessage = {
         id: (Date.now() + 1).toString(),
         type: 'agent',
         content: aiResponse.content,
         timestamp: new Date(),
         confidence_score: aiResponse.confidence,
         suggestions: aiResponse.suggestions,
         provider: aiResponse.provider,
         providerInfo: aiResponse.providerInfo
       };
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
             // Fallback response
       const fallbackResponse: ChatMessage = {
         id: (Date.now() + 1).toString(),
         type: 'agent',
         content: `I apologize, but I'm experiencing technical difficulties. As your ${unifiedAgent.specialization}, I can help you with environmental data analysis, prediction markets, network monitoring, carbon credits, and more. Please try again or ask me about a specific environmental topic.`,
         timestamp: new Date(),
         confidence_score: 75,
         suggestions: ['Analyze current environmental trends', 'Show me prediction market opportunities', 'Generate a sustainability report'],
         provider: 'mock',
         providerInfo: 'Error Fallback - Technical difficulties'
       };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
      setSelectedQuickAction(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    setSelectedQuickAction(action);
    setInputMessage(action.action);
    setShowQuickActions(false);
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('ecochain-chat-unified');
    // Reset to welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'agent',
      content: `Hello! I'm ${unifiedAgent.name}, your ${unifiedAgent.specialization}. I can help you with environmental data analysis, prediction markets, network monitoring, carbon credits, and more. How can I assist you today?`,
      timestamp: new Date(),
      confidence_score: 100
    };
    setMessages([welcomeMessage]);
  };

  const testApiKey = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('🔍 API Key Test:', {
      hasKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'none',
      fullKey: apiKey // Be careful with this in production
    });
    
    // Show alert with API key status
    if (apiKey && apiKey.length > 0) {
      alert(`✅ API Key Found!\nLength: ${apiKey.length} characters\nPreview: ${apiKey.substring(0, 8)}...`);
    } else {
      alert('❌ No API Key Found!\nPlease check your .env file and restart the server.');
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto">
                 {/* Header */}
         <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-3xl font-bold text-gray-800 mb-2">EcoChain AI Assistant</h1>
               <p className="text-gray-600">Your unified environmental intelligence companion</p>
             </div>
             <div className="text-right">
               <div className="text-sm text-gray-600">AI Assistant</div>
               <div className="text-2xl font-bold text-emerald-600">Ready</div>
                               <div className="mt-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== '' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== '' 
                        ? 'bg-green-500' 
                        : 'bg-yellow-500'
                    }`}></span>
                    {import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== '' 
                      ? 'Gemini AI' 
                      : 'Mock Mode'
                    }
                  </div>
                                     {/* Debug Info */}
                   <div className="mt-1 text-xs text-gray-500">
                     API Key: {import.meta.env.VITE_GEMINI_API_KEY ? '✅ Found' : '❌ Missing'}
                   </div>
                   <button
                     onClick={testApiKey}
                     className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                   >
                     Test API Key
                   </button>
                </div>
             </div>
           </div>
         </div>

        {/* Chat Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                     {/* Chat Header */}
           <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
             <div className="flex items-center gap-4">
               <FaRobot className="text-3xl" />
               <div>
                 <h2 className="text-xl font-bold">{unifiedAgent.name}</h2>
                 <p className="text-emerald-100">{unifiedAgent.specialization}</p>
               </div>
               <div className="ml-auto flex items-center gap-4">
                 <div className="text-right">
                   <div className="text-sm text-emerald-100">Multi-Domain</div>
                   <div className="text-sm text-emerald-100">Intelligence</div>
                 </div>
                 <button
                   onClick={clearChatHistory}
                   className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                   title="Clear Chat History"
                 >
                   🗑️ Clear
                 </button>
               </div>
             </div>
           </div>

                           {/* Messages */}
           <div className="h-96 overflow-y-auto p-6 space-y-4">
             {messages.map(message => (
               <div
                 key={message.id}
                 className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div
                   className={`max-w-3xl rounded-2xl p-4 ${
                     message.type === 'user'
                       ? 'bg-emerald-600 text-white'
                       : 'bg-gray-100 text-gray-800'
                   }`}
                 >
                                       <div className="flex items-center gap-2 mb-2">
                      {message.type === 'user' ? (
                        <FiUser className="text-emerald-200" />
                      ) : (
                        <FaRobot className="text-gray-600" />
                      )}
                      <span className="text-sm opacity-75">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.confidence_score && (
                        <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">
                          {message.confidence_score}% confidence
                        </span>
                      )}
                      {message.type === 'agent' && message.provider && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.provider === 'gemini' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {message.provider === 'gemini' ? '🤖 Gemini' : '🎭 Mock'}
                        </span>
                      )}
                    </div>
                                       <div className="prose prose-sm max-w-none">
                      <ReactMarkdown 
                        components={{
                          // Custom styling for different markdown elements
                          h1: ({children}) => <h1 className="text-lg font-bold text-gray-800 mb-2">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-bold text-gray-800 mb-2">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-bold text-gray-800 mb-1">{children}</h3>,
                          p: ({children}) => <p className="mb-2">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          strong: ({children}) => <strong className="font-bold text-gray-800">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-600">{children}</blockquote>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                   
                   {/* Suggestions for AI responses */}
                   {message.type === 'agent' && message.suggestions && (
                     <div className="mt-3 pt-3 border-t border-gray-200">
                       <p className="text-sm text-gray-600 mb-2">💡 Try asking:</p>
                       <div className="flex flex-wrap gap-2">
                         {message.suggestions.map((suggestion, index) => (
                           <button
                             key={index}
                             onClick={() => setInputMessage(suggestion)}
                             className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                           >
                             {suggestion}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             ))}
             
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-gray-100 rounded-2xl p-4">
                   <div className="flex items-center gap-2">
                     <FaRobot className="text-gray-600" />
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             
             <div ref={messagesEndRef} />
           </div>

           {/* Quick Actions Panel */}
           {showQuickActions && messages.length <= 1 && (
             <div className="p-6 border-t border-gray-200 bg-gray-50">
               <div className="mb-4">
                 <h3 className="text-lg font-semibold text-gray-800 mb-2">🚀 Quick Actions</h3>
                 <p className="text-sm text-gray-600">Get instant insights on key environmental topics</p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {quickActions.map(action => (
                   <button
                     key={action.id}
                     onClick={() => handleQuickAction(action)}
                     className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 text-left"
                   >
                     <div className="text-2xl mb-2">{action.icon}</div>
                     <h4 className="font-semibold text-gray-800 text-sm mb-1">{action.label}</h4>
                     <p className="text-xs text-gray-600">{action.description}</p>
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Input */}
           <div className="p-6 border-t border-gray-200">
             <div className="flex gap-4">
               <div className="flex-1">
                 <textarea
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Ask me about environmental data, market predictions, network health, carbon credits, or any environmental topic..."
                   className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                   rows={3}
                   disabled={isLoading}
                 />
                 {selectedQuickAction && (
                   <div className="mt-2 p-2 bg-emerald-50 rounded-lg">
                     <p className="text-xs text-emerald-700">
                       <span className="font-semibold">Quick Action:</span> {selectedQuickAction.label}
                     </p>
                   </div>
                 )}
               </div>
               <div className="flex flex-col gap-2">
                 <button
                   onClick={handleSendMessage}
                   disabled={!inputMessage.trim() || isLoading}
                   className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white p-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                 >
                   <FiSend />
                 </button>
                 <button
                   onClick={() => setShowQuickActions(!showQuickActions)}
                   className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                   title="Toggle Quick Actions"
                 >
                   ⚡
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

export default AIAgentChat;
