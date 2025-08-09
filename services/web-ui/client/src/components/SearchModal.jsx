import React, { useState, useEffect } from 'react';
import { X, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { searchStocks } from '../services/api';
import { useAppContext } from '../context/AppContext';

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAppContext();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const searchResults = await searchStocks(query);
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleStockSelect = (symbol) => {
    dispatch({ type: 'SET_SELECTED_STOCK', payload: symbol });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-4 pt-16">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search Stocks & News
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by symbol or company name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stock.name}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${stock.price.toFixed(2)}
                      </span>
                      <span className={`flex items-center text-sm ${
                        stock.change >= 0 ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Start typing to search stocks...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;