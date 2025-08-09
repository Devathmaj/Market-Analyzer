import { Stock, StockHistory, NewsArticle, MarketIndex, TradingSignal, AnalyticsData, UserSettings } from '../types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  return response.json() as Promise<T>;
}

export async function getStockData(): Promise<{ stocks: Stock[]; indices: MarketIndex[] }> {
  const response = await fetch(`${API_BASE_URL}/stocks`);
  return handleResponse<{ stocks: Stock[]; indices: MarketIndex[] }>(response);
}

export async function getStockHistory(symbol: string): Promise<StockHistory[]> {
  const response = await fetch(`${API_BASE_URL}/stocks/${symbol}/history`);
  return handleResponse<StockHistory[]>(response);
}

export async function getMarketNews(): Promise<NewsArticle[]> {
  const response = await fetch(`${API_BASE_URL}/news`);
  return handleResponse<NewsArticle[]>(response);
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  return handleResponse<AnalyticsData>(response);
}

export async function getTradingSignals(): Promise<TradingSignal[]> {
  const response = await fetch(`${API_BASE_URL}/signals`);
  return handleResponse<TradingSignal[]>(response);
}

export async function updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const response = await fetch(`${API_BASE_URL}/user/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return handleResponse<UserSettings>(response);
}