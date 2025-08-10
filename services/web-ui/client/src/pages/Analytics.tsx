import React, { useState, useEffect } from 'react';
import { TrendingUp, Heart, AlertTriangle } from 'lucide-react';
import { AnalyticsData } from '../types';
import { getAnalyticsData } from '../services/api';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { isLoading, setIsLoading } = useAppContext();

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await getAnalyticsData();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [setIsLoading]);

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const sentimentData = [
    { name: 'Positive', value: analytics.sentiment.positive, color: '#10B981' },
    { name: 'Negative', value: analytics.sentiment.negative, color: '#EF4444' },
    { name: 'Neutral', value: analytics.sentiment.neutral, color: '#6B7280' }
  ];

  const getFearGreedLabel = (index: number) => {
    if (index >= 75) return { label: 'Extreme Greed', color: 'text-error-500' };
    if (index >= 55) return { label: 'Greed', color: 'text-warning-500' };
    if (index >= 45) return { label: 'Neutral', color: 'text-gray-500' };
    if (index >= 25) return { label: 'Fear', color: 'text-warning-500' };
    return { label: 'Extreme Fear', color: 'text-error-500' };
  };

  const fearGreedInfo = getFearGreedLabel(analytics.fearGreedIndex);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Market Volatility</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.marketVolatility.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
              <AlertTriangle className="text-warning-500" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Fear & Greed Index</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.fearGreedIndex}
              </p>
              <p className={`text-sm font-medium ${fearGreedInfo.color}`}>
                {fearGreedInfo.label}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <Heart className="text-primary-500" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Trending Stocks</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.trendingStocks.length}
              </p>
            </div>
            <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-lg">
              <TrendingUp className="text-success-500" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <Card title="Market Sentiment">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Trending Stocks */}
        <Card title="Trending Stocks by Mentions">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.trendingStocks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="symbol"
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-colors-gray-800)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="mentions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Trending Stocks Table */}
      <Card title="Trending Stocks Details">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Symbol</th>
                <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Name</th>
                <th className="text-right py-2 font-medium text-gray-900 dark:text-white">Mentions</th>
                <th className="text-right py-2 font-medium text-gray-900 dark:text-white">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {analytics.trendingStocks.map((stock: any) => (
                <tr key={stock.symbol} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 font-bold text-gray-900 dark:text-white">{stock.symbol}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{stock.name}</td>
                  <td className="py-3 text-right text-gray-900 dark:text-white">
                    {stock.mentions.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stock.sentiment > 0.3
                          ? 'text-success-600 bg-success-100 dark:bg-success-900/20'
                          : stock.sentiment < -0.3
                          ? 'text-error-600 bg-error-100 dark:bg-error-900/20'
                          : 'text-gray-600 bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      {stock.sentiment > 0 ? '+' : ''}{(stock.sentiment * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;