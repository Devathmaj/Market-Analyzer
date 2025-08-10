import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StockQuote } from '../types';
import { getStockData } from '../services/api';
import Card from '../components/Card';

const Dashboard: React.FC = () => {
  const { selectedStock, setSelectedStock, isLoading, setIsLoading } = useAppContext();
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (selectedStock) {
        setIsLoading(true);
        try {
          const data = await getStockData(selectedStock);
          setStockQuote(data.quote);
        } catch (error) {
          console.error('Failed to load stock data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [selectedStock, setIsLoading]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicker = formData.get('ticker') as string;
    setSelectedStock(newTicker);
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return 'N/A';
    }
    return `${price.toFixed(2)}`;
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Dashboard</h2>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            name="ticker"
            defaultValue={selectedStock}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            placeholder="Enter stock ticker..."
          />
          <button
            type="submit"
            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {stockQuote && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Current Price">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(stockQuote.current_price)}</p>
          </Card>
          <Card title="High Price of the Day">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(stockQuote.high_price_of_the_day)}</p>
          </Card>
          <Card title="Low Price of the Day">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(stockQuote.low_price_of_the_day)}</p>
          </Card>
          <Card title="Previous Close Price">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(stockQuote.previous_close_price)}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;