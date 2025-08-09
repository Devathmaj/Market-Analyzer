import React, { useState, useEffect } from 'react';
import { Stock } from '../types';
import { getStockData } from '../services/api';

const StockTicker: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const data = await getStockData();
        setStocks(data.stocks);
      } catch (error) {
        console.error('Failed to load stocks:', error);
      }
    };

    loadStocks();
    const interval = setInterval(loadStocks, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <div className="inline-flex space-x-8">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="inline-flex items-center space-x-2">
              <span className="font-bold">{stock.symbol}</span>
              <span>{formatPrice(stock.price)}</span>
              <span className={stock.change >= 0 ? 'text-success-500' : 'text-error-500'}>
                {formatChange(stock.change, stock.changePercent)}
              </span>
            </div>
          ))}
          {/* Duplicate for seamless scrolling */}
          {stocks.map((stock) => (
            <div key={`${stock.symbol}-dup`} className="inline-flex items-center space-x-2">
              <span className="font-bold">{stock.symbol}</span>
              <span>{formatPrice(stock.price)}</span>
              <span className={stock.change >= 0 ? 'text-success-500' : 'text-error-500'}>
                {formatChange(stock.change, stock.changePercent)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockTicker;