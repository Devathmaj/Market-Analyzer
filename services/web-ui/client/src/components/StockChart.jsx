import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStockHistory } from '../services/api';

function StockChart({ symbol, period = '1M' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const historyData = await fetchStockHistory(symbol, period);
        setData(historyData.data);
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Close']}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;