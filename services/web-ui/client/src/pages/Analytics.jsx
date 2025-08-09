import React, { useState, useEffect } from 'react';
import { fetchAnalyticsData } from '../services/api';
import { TrendingUp, TrendingDown, Activity, Heart, Frown, Smile } from 'lucide-react';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await fetchAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.7) return <Smile className="h-6 w-6 text-success-600" />;
    if (sentiment >= 0.4) return <Activity className="h-6 w-6 text-yellow-600" />;
    return <Frown className="h-6 w-6 text-danger-600" />;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 0.7) return 'text-success-600';
    if (sentiment >= 0.4) return 'text-yellow-600';
    return 'text-danger-600';
  };

  const getSignalBadge = (signal) => {
    const colors = {
      strong_buy: 'bg-success-100 text-success-800 border-success-200',
      buy: 'bg-success-50 text-success-700 border-success-200',
      hold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      sell: 'bg-danger-50 text-danger-700 border-danger-200',
      strong_sell: 'bg-danger-100 text-danger-800 border-danger-200'
    };
    
    return colors[signal] || colors.hold;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Market Analytics
      </h1>

      {/* Overall Sentiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Overall Sentiment
              </p>
              <p className={`text-3xl font-bold ${getSentimentColor(analyticsData.marketSentiment.overall)}`}>
                {(analyticsData.marketSentiment.overall * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analyticsData.marketSentiment.trend}
              </p>
            </div>
            {getSentimentIcon(analyticsData.marketSentiment.overall)}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Fear & Greed Index
              </p>
              <p className={`text-3xl font-bold ${getSentimentColor(analyticsData.fearGreedIndex / 100)}`}>
                {analyticsData.fearGreedIndex}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analyticsData.fearGreedIndex > 70 ? 'Greed' : analyticsData.fearGreedIndex < 30 ? 'Fear' : 'Neutral'}
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Volatility Index
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analyticsData.volatilityIndex}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analyticsData.volatilityIndex > 20 ? 'High' : analyticsData.volatilityIndex > 15 ? 'Medium' : 'Low'}
              </p>
            </div>
            <Activity className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Social Sentiment
              </p>
              <p className={`text-3xl font-bold ${getSentimentColor(analyticsData.socialSentiment.overall)}`}>
                {(analyticsData.socialSentiment.overall * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Combined platforms
              </p>
            </div>
            {getSentimentIcon(analyticsData.socialSentiment.overall)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Sentiment */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Sector Sentiment
          </h2>
          <div className="space-y-4">
            {Object.entries(analyticsData.marketSentiment.sectors).map(([sector, data]) => (
              <div key={sector} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getSentimentIcon(data.sentiment)}
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {sector}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${getSentimentColor(data.sentiment)}`}>
                    {(data.sentiment * 100).toFixed(0)}%
                  </span>
                  <span className={`text-sm flex items-center ${
                    data.change >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {data.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(data.change * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Breakdown */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Social Media Sentiment
          </h2>
          <div className="space-y-4">
            {Object.entries(analyticsData.socialSentiment)
              .filter(([key]) => key !== 'overall')
              .map(([platform, sentiment]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSentimentIcon(sentiment)}
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {platform}
                    </span>
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${getSentimentColor(sentiment)}`}>
                        {(sentiment * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${sentiment >= 0.7 ? 'bg-success-600' : sentiment >= 0.4 ? 'bg-yellow-600' : 'bg-danger-600'}`}
                        style={{ width: `${sentiment * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Trending Stocks */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Trending Stocks
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Symbol
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Change
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Signal
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Confidence
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.trendingStocks.map((stock) => (
                <tr key={stock.symbol} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {stock.symbol}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stock.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center ${
                      stock.change >= 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSignalBadge(stock.signal)}`}>
                      {stock.signal.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 bg-primary-600 rounded-full"
                          style={{ width: `${stock.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(stock.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;