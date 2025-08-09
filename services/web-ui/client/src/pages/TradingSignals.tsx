import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Minus, Clock } from 'lucide-react';
import { TradingSignal } from '../types';
import { getTradingSignals } from '../services/api';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';

const TradingSignals: React.FC = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'hold'>('all');
  const { isLoading, setIsLoading } = useAppContext();

  useEffect(() => {
    const loadSignals = async () => {
      setIsLoading(true);
      try {
        const data = await getTradingSignals();
        setSignals(data);
      } catch (error) {
        console.error('Failed to load signals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSignals();
  }, [setIsLoading]);

  const filteredSignals = signals.filter(signal => 
    filter === 'all' || signal.signal === filter
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <ArrowUp className="text-success-500" size={20} />;
      case 'sell':
        return <ArrowDown className="text-error-500" size={20} />;
      default:
        return <Minus className="text-gray-500" size={20} />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-success-600 bg-success-100 dark:bg-success-900/20';
      case 'sell':
        return 'text-error-600 bg-error-100 dark:bg-error-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success-600';
    if (confidence >= 60) return 'text-warning-600';
    return 'text-error-600';
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Signals</h2>
        
        <div className="flex space-x-2">
          {['all', 'buy', 'sell', 'hold'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === filterOption
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Signals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Signals</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{signals.length}</p>
            </div>
            <Clock className="text-gray-400" size={24} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Buy Signals</h3>
              <p className="text-2xl font-bold text-success-500">
                {signals.filter(s => s.signal === 'buy').length}
              </p>
            </div>
            <ArrowUp className="text-success-500" size={24} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Sell Signals</h3>
              <p className="text-2xl font-bold text-error-500">
                {signals.filter(s => s.signal === 'sell').length}
              </p>
            </div>
            <ArrowDown className="text-error-500" size={24} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Hold Signals</h3>
              <p className="text-2xl font-bold text-gray-500">
                {signals.filter(s => s.signal === 'hold').length}
              </p>
            </div>
            <Minus className="text-gray-500" size={24} />
          </div>
        </Card>
      </div>

      {/* Signals Table */}
      <Card title="Active Trading Signals">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 font-medium text-gray-900 dark:text-white">Symbol</th>
                <th className="text-center py-3 font-medium text-gray-900 dark:text-white">Signal</th>
                <th className="text-right py-3 font-medium text-gray-900 dark:text-white">Price</th>
                <th className="text-center py-3 font-medium text-gray-900 dark:text-white">Confidence</th>
                <th className="text-left py-3 font-medium text-gray-900 dark:text-white">Reasoning</th>
                <th className="text-right py-3 font-medium text-gray-900 dark:text-white">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((signal) => (
                <tr
                  key={signal.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-4 font-bold text-gray-900 dark:text-white">
                    {signal.symbol}
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {getSignalIcon(signal.signal)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getSignalColor(signal.signal)}`}
                      >
                        {signal.signal}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium text-gray-900 dark:text-white">
                    ${signal.price.toFixed(2)}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`font-medium ${getConfidenceColor(signal.confidence)}`}>
                      {signal.confidence}%
                    </span>
                  </td>
                  <td className="py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                    {signal.reasoning}
                  </td>
                  <td className="py-4 text-right text-gray-500 dark:text-gray-400">
                    {formatTime(signal.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSignals.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No signals found for the selected filter.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TradingSignals;