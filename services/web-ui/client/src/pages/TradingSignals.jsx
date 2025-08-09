import React, { useState, useEffect } from 'react';
import { fetchTradingSignals } from '../services/api';
import { TrendingUp, TrendingDown, Clock, Target, Shield } from 'lucide-react';

function TradingSignals() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadSignals = async () => {
      setLoading(true);
      try {
        const data = await fetchTradingSignals();
        setSignals(data);
      } catch (error) {
        console.error('Error loading trading signals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSignals();
  }, []);

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    return signal.signal === filter;
  });

  const getSignalBadge = (signal) => {
    const configs = {
      strong_buy: { bg: 'bg-success-100', text: 'text-success-800', border: 'border-success-200', label: 'STRONG BUY' },
      buy: { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200', label: 'BUY' },
      hold: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'HOLD' },
      sell: { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200', label: 'SELL' },
      strong_sell: { bg: 'bg-danger-100', text: 'text-danger-800', border: 'border-danger-200', label: 'STRONG SELL' }
    };
    
    return configs[signal] || configs.hold;
  };

  const getRiskBadge = (risk) => {
    const configs = {
      low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    };
    
    return configs[risk] || configs.medium;
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Trading Signals
        </h1>
        
        {/* Filter buttons */}
        <div className="flex space-x-2">
          {['all', 'strong_buy', 'buy', 'hold', 'sell'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterType === 'all' ? 'All' : filterType.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid gap-6">
        {filteredSignals.map((signal) => {
          const signalConfig = getSignalBadge(signal.signal);
          const riskConfig = getRiskBadge(signal.riskLevel);
          
          return (
            <div key={signal.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {signal.symbol}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {signal.name}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full border ${signalConfig.bg} ${signalConfig.text} ${signalConfig.border}`}>
                      {signalConfig.label}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${riskConfig.bg} ${riskConfig.text} ${riskConfig.border}`}>
                      {signal.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${signal.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current Price
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-success-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Target</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${signal.targetPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-danger-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stop Loss</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${signal.stopLoss.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Timeframe</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {signal.timeframe}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 bg-primary-600 rounded-full"
                        style={{ width: `${signal.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {(signal.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Analysis
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {signal.reasoning}
                </p>
                
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Generated: {new Date(signal.timestamp).toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      signal.signal.includes('buy') ? 'bg-success-500' :
                      signal.signal === 'hold' ? 'bg-yellow-500' : 'bg-danger-500'
                    }`} />
                    <span>Active Signal</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSignals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No signals found for the selected filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default TradingSignals;