import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchStockData } from '../services/api';

function StockTicker() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const data = await fetchStockData();
        setStocks(data);
      } catch (error) {
        console.error('Error loading ticker data:', error);
      }
    };

    loadStocks();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="py-2">
        <div className="animate-scroll whitespace-nowrap flex space-x-8">
          {stocks.concat(stocks).map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="inline-flex items-center space-x-2 text-sm"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {stock.symbol}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                ${stock.price.toFixed(2)}
              </span>
              <span className={`flex items-center ${
                stock.change >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StockTicker;