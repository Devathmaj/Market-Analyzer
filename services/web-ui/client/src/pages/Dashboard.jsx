import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import StockTicker from '../components/StockTicker';
import StockChart from '../components/StockChart';
import { fetchMarketOverview, fetchStockData } from '../services/api';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

function Dashboard() {
  const { state, dispatch } = useAppContext();
  const [marketData, setMarketData] = useState(null);
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [market, stocks] = await Promise.all([
          fetchMarketOverview(),
          fetchStockData()
        ]);
        
        setMarketData(market);
        
        // Filter watchlist stocks
        const watchlist = stocks.filter(stock => 
          state.watchlist.includes(stock.symbol)
        );
        setWatchlistData(watchlist);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [state.watchlist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Ticker */}
      <StockTicker />

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketData?.indices.map((index) => (
          <div key={index.symbol} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {index.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {index.value.toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary-600" />
            </div>
            <div className="mt-4 flex items-center">
              {index.change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-danger-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                index.change >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Price Chart - {state.selectedStock}
            </h2>
            <select
              value={state.selectedStock}
              onChange={(e) => dispatch({ type: 'SET_SELECTED_STOCK', payload: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {state.watchlist.map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>
          <StockChart symbol={state.selectedStock} />
        </div>

        {/* Watchlist */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Your Watchlist
          </h2>
          <div className="space-y-4">
            {watchlistData.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => dispatch({ type: 'SET_SELECTED_STOCK', payload: stock.symbol })}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {stock.symbol}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stock.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${stock.price.toFixed(2)}
                  </p>
                  <p className={`text-sm flex items-center ${
                    stock.change >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Market Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">
              {marketData?.marketStats.advancingStocks}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Advancing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger-600">
              {marketData?.marketStats.decliningStocks}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Declining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {marketData?.marketStats.unchangedStocks}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unchanged</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">
              {marketData?.marketStats.newHighs}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">New Highs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger-600">
              {marketData?.marketStats.newLows}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">New Lows</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;