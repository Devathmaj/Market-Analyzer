import stocksData from '../mock/stocks.json';
import stockHistoryData from '../mock/stockHistory.json';
import newsData from '../mock/news.json';
import analyticsData from '../mock/analytics.json';
import signalsData from '../mock/signals.json';
import { Stock, StockHistory, NewsArticle, MarketIndex, TradingSignal, AnalyticsData, UserSettings } from '../types';

/**
 * Fetches current stock data including prices and market indices
 * Backend endpoint: GET /api/stocks
 * @returns Promise<{stocks: Stock[], indices: MarketIndex[]}>
 */
export const fetchStockData = async (): Promise<{stocks: Stock[], indices: MarketIndex[]}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    stocks: stocksData.stocks as Stock[],
    indices: stocksData.indices as MarketIndex[]
  };
};

/**
 * Fetches historical price data for a specific stock symbol
 * Backend endpoint: GET /api/stocks/{symbol}/history
 * @param symbol - Stock symbol (e.g., "AAPL")
 * @returns Promise<StockHistory[]>
 */
export const fetchStockHistory = async (symbol: string): Promise<StockHistory[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Type assertion needed due to JSON import limitations
  const historyData = stockHistoryData as Record<string, StockHistory[]>;
  return historyData[symbol] || [];
};

/**
 * Fetches latest market news articles
 * Backend endpoint: GET /api/news
 * @returns Promise<NewsArticle[]>
 */
export const fetchMarketNews = async (): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return newsData.articles as NewsArticle[];
};

/**
 * Fetches market analytics data including sentiment and trending stocks
 * Backend endpoint: GET /api/analytics
 * @returns Promise<AnalyticsData>
 */
export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return analyticsData as AnalyticsData;
};

/**
 * Fetches trading signals with buy/sell/hold recommendations
 * Backend endpoint: GET /api/signals
 * @returns Promise<TradingSignal[]>
 */
export const fetchTradingSignals = async (): Promise<TradingSignal[]> => {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return signalsData.signals as TradingSignal[];
};

/**
 * Updates user settings
 * Backend endpoint: PUT /api/user/settings
 * @param settings - Partial user settings to update
 * @returns Promise<UserSettings>
 */
export const updateUserSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real implementation, this would update the backend and return the updated settings
  const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  const updatedSettings = { ...currentSettings, ...settings };
  localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
  
  return updatedSettings as UserSettings;
};