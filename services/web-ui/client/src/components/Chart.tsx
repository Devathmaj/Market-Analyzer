import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockHistory } from '../types';

interface ChartProps {
  data: StockHistory[];
  symbol: string;
}

const Chart: React.FC<ChartProps> = ({ data, symbol }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{formatDate(label)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Open: {formatPrice(data.open)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">High: {formatPrice(data.high)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Low: {formatPrice(data.low)}</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Close: {formatPrice(data.close)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Volume: {data.volume.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip content={customTooltip} />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;