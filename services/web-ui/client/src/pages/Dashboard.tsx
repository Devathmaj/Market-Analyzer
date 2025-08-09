import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Stock, MarketIndex, StockHistory } from '../types';
import { getStockData, getStockHistory } from '../services/api';
import Card from '../components/Card';
import Chart from '../components/Chart';
import StockTicker from '../components/StockTicker';

const Dashboard: React.FC = () => {
  const { selectedStock, setSelectedStock, isLoading, setIsLoading } = useAppContext();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getStockData();
        setStocks(data.stocks);
        setIndices(data.indices);
      } catch (error) {
        console.error('Failed to load stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setIsLoading]);

  useEffect(() => {
    const loadStockHistory = async () => {
      if (selectedStock) {
        try {
          const history = await getStockHistory(selectedStock);
          setStockHistory(history);
        } catch (error) {
          console.error('Failed to load stock history:', error);
        }
      }
    };

    loadStockHistory();
  }, [selectedStock]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Ticker */}
      <StockTicker />

      {/* Market Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {indices.map((index) => (
            <Card key={index.symbol}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{index.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(index.value)}
                  </p>
                </div>
                <div className={`flex items-center ${index.change >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                  {index.change >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  <span className="ml-2 font-medium">
                    {formatChange(index.change, index.changePercent)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Chart */}
        <Card title={`${selectedStock} Price Chart`} className="lg:col-span-2">
          <div className="mb-4">
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </select>
          </div>
          <Chart data={stockHistory} />
        </Card>

        {/* Top Stocks */}
        <Card title="Top Stocks" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Symbol</th>
                  <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Name</th>
                  <th className="text-right py-2 font-medium text-gray-900 dark:text-white">Price</th>
                  <th className="text-right py-2 font-medium text-gray-900 dark:text-white">Change</th>
                  <th className="text-right py-2 font-medium text-gray-900 dark:text-white">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    <td className="py-3 font-bold text-gray-900 dark:text-white">{stock.symbol}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{stock.name}</td>
                    <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                      {formatPrice(stock.price)}
                    </td>
                    <td className={`py-3 text-right font-medium ${stock.change >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                      {formatChange(stock.change, stock.changePercent)}
                    </td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-300">
                      {formatMarketCap(stock.marketCap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;