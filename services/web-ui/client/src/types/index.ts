export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  timestamp: string;
  price: number;
  reasoning: string;
}

export interface AnalyticsData {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  trendingStocks: Array<{
    symbol: string;
    name: string;
    mentions: number;
    sentiment: number;
  }>;
  marketVolatility: number;
  fearGreedIndex: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  apiKey: string;
  preferredStocks: string[];
  notifications: boolean;
}

export interface AppContextType {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  selectedStock: string;
  setSelectedStock: (stock: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}