/**
 * API Service Layer for Gemini Market Intelligence Platform
 * 
 * All functions are currently returning mock data but are structured
 * to easily integrate with backend endpoints when ready.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Simulates API delay for realistic UX
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generic fetch wrapper for future backend integration
 */
async function apiCall(endpoint, options = {}) {
  // For now, we'll use mock data
  await delay(Math.random() * 1000 + 500); // Random delay 500-1500ms
  
  // In production, this would be:
  // const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     ...options.headers,
  //   },
  //   ...options,
  // });
  // return response.json();
  
  return Promise.resolve();
}

/**
 * Fetch real-time stock data for ticker display
 * 
 * @description Gets current stock prices, changes, and basic info
 * @endpoint GET /stocks/realtime
 * @returns {Promise<Array>} Array of stock objects with symbol, price, change, changePercent
 */
export async function fetchStockData() {
  await delay(800);
  
  // Mock data - replace with actual API call
  const mockData = await import('../mock/stockData.json');
  return mockData.default || mockData;
}

/**
 * Fetch historical price data for a specific stock
 * 
 * @description Gets historical price data for charting
 * @endpoint GET /stocks/{symbol}/history?period={period}
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @param {string} period - Time period ('1D', '5D', '1M', '3M', '1Y')
 * @returns {Promise<Object>} Object with symbol and historical data array
 */
export async function fetchStockHistory(symbol, period = '1M') {
  await delay(600);
  
  // Mock data - replace with actual API call
  const mockData = await import('../mock/stockHistory.json');
  const data = mockData.default || mockData;
  
  // Filter by symbol if provided
  return data.find(item => item.symbol === symbol) || data[0];
}

/**
 * Fetch latest market news
 * 
 * @description Gets recent market news articles with sentiment analysis
 * @endpoint GET /news/market?limit={limit}&category={category}
 * @param {number} limit - Number of articles to return (default: 20)
 * @param {string} category - News category filter (optional)
 * @returns {Promise<Array>} Array of news article objects
 */
export async function fetchMarketNews(limit = 20, category = null) {
  await delay(700);
  
  // Mock data - replace with actual API call
  const mockData = await import('../mock/marketNews.json');
  const data = mockData.default || mockData;
  
  return data.slice(0, limit);
}

/**
 * Fetch analytics data including sentiment and trending stocks
 * 
 * @description Gets market sentiment analysis and trending stock data
 * @endpoint GET /analytics/overview
 * @returns {Promise<Object>} Object with sentiment data and trending stocks
 */
export async function fetchAnalyticsData() {
  await delay(900);
  
  // Mock data - replace with actual API call
  const mockData = await import('../mock/analyticsData.json');
  return mockData.default || mockData;
}

/**
 * Fetch trading signals for all watched stocks
 * 
 * @description Gets AI-generated trading signals with confidence scores
 * @endpoint GET /signals/trading
 * @returns {Promise<Array>} Array of trading signal objects
 */
export async function fetchTradingSignals() {
  await delay(1000);
  
  // Mock data - replace with actual API call
  const mockData = await import('../mock/tradingSignals.json');
  return mockData.default || mockData;
}

/**
 * Update user settings and preferences
 * 
 * @description Updates user configuration including API keys and preferences
 * @endpoint PUT /user/settings
 * @param {Object} settings - Settings object to update
 * @returns {Promise<Object>} Updated settings object
 */
export async function updateUserSettings(settings) {
  await delay(500);
  
  // Mock response - replace with actual API call
  console.log('Settings updated:', settings);
  
  return {
    success: true,
    message: 'Settings updated successfully',
    data: settings
  };
}

/**
 * Search for stocks by symbol or company name
 * 
 * @description Searches for stocks matching the query
 * @endpoint GET /stocks/search?q={query}
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching stock objects
 */
export async function searchStocks(query) {
  await delay(300);
  
  // Mock search - replace with actual API call
  const stockData = await fetchStockData();
  return stockData.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Get market overview data (indices)
 * 
 * @description Gets major market indices data
 * @endpoint GET /market/overview
 * @returns {Promise<Object>} Object with major indices data
 */
export async function fetchMarketOverview() {
  await delay(400);
  
  // Mock data - replace with actual API call
  const mockData = await import('../mock/marketOverview.json');
  return mockData.default || mockData;
}