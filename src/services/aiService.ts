// AI Service for EcoChain - Gemini API Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// EcoChain-specific system prompt
const ECOCHAIN_SYSTEM_PROMPT = `You are the EcoChain AI Assistant, a specialized environmental intelligence agent with expertise in:

**Core Domains:**
- Environmental Data Analysis (air quality, water quality, climate data)
- Prediction Market Trading (carbon credits, environmental futures)
- DePIN Network Monitoring (sensor networks, IoT devices)
- Carbon Credit Analysis (market trends, compliance, voluntary markets)
- Cross-Chain Data Validation (blockchain data integrity)
- Sustainability Metrics (ESG reporting, impact assessment)

**Your Capabilities:**
- Provide detailed environmental analysis with specific metrics and data
- Offer actionable recommendations for environmental challenges
- Analyze market trends in carbon credits and environmental assets
- Monitor and report on sensor network health and performance
- Generate comprehensive sustainability reports
- Assess climate impact on various sectors

 **Response Format:**
 - Use **Markdown formatting** for better readability
 - Use **bold text** for headers and key points
 - Include specific data points, percentages, and metrics
 - Provide confidence scores for your analysis
 - Offer actionable recommendations in bullet points
 - Use environmental emojis and visual indicators
 - Include relevant market data and trends
 - Structure responses with clear sections using headers

**Key Focus Areas:**
- Real-time environmental data interpretation
- Market analysis for environmental assets
- Network optimization and predictive maintenance
- Sustainability impact assessment
- Climate adaptation strategies

Always provide comprehensive, data-driven insights that help users make informed environmental and sustainability decisions.`;

export interface AIResponse {
  content: string;
  confidence: number;
  suggestions: string[];
  provider: 'gemini' | 'mock';
  providerInfo: string;
  data_visualization?: {
    type: 'chart' | 'metric' | 'alert';
    data: any;
  };
}

export class AIService {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateResponse(userInput: string, context?: string): Promise<AIResponse> {
    // Check if Gemini API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const hasApiKey = apiKey && apiKey !== '';
    
    // Debug logging
    console.log('🔍 API Key Check:', {
      hasKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'none'
    });
    
    if (!hasApiKey) {
      console.log('🤖 AI Agent: Using Mock Response (No Gemini API Key)');
      return this.getFallbackResponse(userInput);
    }

    try {
      console.log('🤖 AI Agent: Using Gemini API');
      
      const prompt = `${ECOCHAIN_SYSTEM_PROMPT}

User Query: "${userInput}"

${context ? `Context: ${context}` : ''}

Please provide a comprehensive analysis with:
1. Detailed environmental insights
2. Specific data points and metrics
3. Actionable recommendations
4. Confidence assessment
5. Relevant follow-up suggestions

Format your response professionally with clear sections and environmental context.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract confidence score (look for patterns like "confidence: X%" or "X% confidence")
      const confidenceMatch = text.match(/(\d+)%?\s*confidence/i) || 
                             text.match(/confidence[:\s]*(\d+)%?/i);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 85;

      // Generate suggestions based on the response
      const suggestions = this.generateSuggestions(userInput, text);

      return {
        content: text,
        confidence,
        suggestions,
        provider: 'gemini',
        providerInfo: 'Google Gemini AI - Real-time environmental intelligence'
      };
         } catch (error) {
       console.error('🤖 AI Agent: Gemini API Error, falling back to mock response:', error);
       
       // Log more detailed error information
       if (error instanceof Error) {
         console.error('Error details:', {
           name: error.name,
           message: error.message,
           stack: error.stack
         });
       }
       
       // Fallback to mock response if API fails
       return this.getFallbackResponse(userInput);
     }
  }

  private generateSuggestions(userInput: string, aiResponse: string): string[] {
    const input = userInput.toLowerCase();
    const suggestions: string[] = [];

    // Context-aware suggestions based on user input and AI response
    if (input.includes('air') || input.includes('quality') || input.includes('pollution')) {
      suggestions.push('Show me air quality trends for the last week');
      suggestions.push('What are the main sources of air pollution?');
      suggestions.push('Compare air quality across different cities');
      suggestions.push('Analyze the impact of traffic on air quality');
    } else if (input.includes('carbon') || input.includes('market') || input.includes('credits')) {
      suggestions.push('What are the current carbon credit prices?');
      suggestions.push('Show me carbon market trading opportunities');
      suggestions.push('Analyze carbon credit project performance');
      suggestions.push('Compare voluntary vs compliance carbon markets');
    } else if (input.includes('network') || input.includes('sensor') || input.includes('health')) {
      suggestions.push('Show me sensor network status');
      suggestions.push('Identify sensors needing maintenance');
      suggestions.push('Analyze network data quality metrics');
      suggestions.push('Predict sensor failure patterns');
    } else if (input.includes('trends') || input.includes('environmental') || input.includes('analysis')) {
      suggestions.push('Show me climate change indicators');
      suggestions.push('Analyze biodiversity trends');
      suggestions.push('Compare energy transition progress');
      suggestions.push('Assess water resource trends');
    } else if (input.includes('sustainability') || input.includes('report') || input.includes('esg')) {
      suggestions.push('Show me carbon footprint breakdown');
      suggestions.push('Analyze resource efficiency metrics');
      suggestions.push('Compare ESG performance across sectors');
      suggestions.push('Generate sustainability recommendations');
    } else if (input.includes('weather') || input.includes('climate') || input.includes('impact')) {
      suggestions.push('Show me extreme weather patterns');
      suggestions.push('Analyze climate impact on agriculture');
      suggestions.push('Assess energy system resilience');
      suggestions.push('Predict climate adaptation needs');
    } else {
      suggestions.push('Analyze current environmental trends');
      suggestions.push('Show me prediction market opportunities');
      suggestions.push('Generate a sustainability report');
      suggestions.push('Assess climate impact on different sectors');
    }

    return suggestions;
  }

  private getFallbackResponse(userInput: string): AIResponse {
    // Fallback to current mock implementation
    const input = userInput.toLowerCase();
    let content = '';
    const confidence = 85 + Math.random() * 10;

    if (input.includes('air quality') || input.includes('pollution') || input.includes('aqi')) {
      content = `Based on my analysis of air quality data, I can see several important trends:

**Current Air Quality Status:**
• PM2.5 levels: Moderate (12-35 μg/m³)
• PM10 levels: Good to Moderate (25-50 μg/m³)
• Ozone levels: Low to Moderate

**Key Insights:**
• Peak pollution occurs during rush hours (7-9 AM, 5-7 PM)
• Industrial areas show 15% higher particulate matter
• Weekend levels are typically 20% lower than weekdays

**Recommendations:**
• Consider implementing traffic restrictions during peak hours
• Monitor industrial emissions in the eastern sector
• Increase green infrastructure in high-traffic areas

My confidence in this analysis is ${Math.round(confidence)}%.`;
    } else {
      content = `I understand you're asking about "${userInput}". As your Multi-Domain Environmental Intelligence, I can help you with environmental data analysis, prediction markets, network monitoring, carbon credits, and more. Please ask me about any specific environmental topic for detailed insights.`;
    }

    return {
      content,
      confidence: Math.round(confidence),
      suggestions: this.generateSuggestions(userInput, content),
      provider: 'mock',
      providerInfo: 'Mock Response - Demo mode (Add VITE_GEMINI_API_KEY for real AI)'
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
