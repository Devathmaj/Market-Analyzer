export interface ArticleSource {
  name: string;
}

export interface Article {
  title: string;
  author: string | null;
  source: ArticleSource;
  url: string;
}

export interface StockQuote {
  current_price: number;
  high_price_of_the_day: number;
  low_price_of_the_day: number;
  open_price_of_the_day: number;
  previous_close_price: number;
}

export interface AnalysisResult {
  ticker: string;
  quote: StockQuote;
  articles: Article[];
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
}

export interface StockHistory {
  date: string;
  price: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  content: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
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
  fearGreedIndex: number;
  marketVolatility: number;
  trendingStocks: any[];
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: {
    priceAlerts: boolean;
    newsAlerts: boolean;
  };
  preferredStocks: string[];
  apiKey: string;
}

export interface AppContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  selectedStock: string;
  setSelectedStock: (symbol: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}