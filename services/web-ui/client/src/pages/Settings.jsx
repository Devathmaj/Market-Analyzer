import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { updateUserSettings } from '../services/api';
import { Sun, Moon, Save, Plus, X, Key } from 'lucide-react';

function Settings() {
  const { state, dispatch } = useAppContext();
  const [apiKey, setApiKey] = useState(state.apiKey);
  const [newStock, setNewStock] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await updateUserSettings({
        theme: state.theme,
        apiKey: apiKey,
        watchlist: state.watchlist
      });
      
      dispatch({ type: 'SET_API_KEY', payload: apiKey });
      setMessage('Settings saved successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
      console.error('Settings save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addToWatchlist = () => {
    if (newStock.trim() && !state.watchlist.includes(newStock.toUpperCase())) {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: newStock.toUpperCase() });
      setNewStock('');
    }
  };

  const removeFromWatchlist = (stock) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: stock });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.includes('success') 
            ? 'bg-success-50 border-success-200 text-success-700'
            : 'bg-danger-50 border-danger-200 text-danger-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => dispatch({ type: 'SET_THEME', payload: 'light' })}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                    state.theme === 'light'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                  }`}
                >
                  <Sun className="h-5 w-5 mr-2" />
                  Light
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                    state.theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                  }`}
                >
                  <Moon className="h-5 w-5 mr-2" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            API Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your API key is stored locally and never shared.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Management */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Watchlist Management
        </h2>
        
        <div className="space-y-4">
          {/* Add new stock */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
            />
            <button
              onClick={addToWatchlist}
              disabled={!newStock.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>

          {/* Current watchlist */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Watchlist ({state.watchlist.length} stocks)
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.watchlist.map((stock) => (
                <div
                  key={stock}
                  className="flex items-center bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-3 py-2 rounded-lg border border-primary-200 dark:border-primary-800"
                >
                  <span className="font-medium">{stock}</span>
                  <button
                    onClick={() => removeFromWatchlist(stock)}
                    className="ml-2 text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          User Profile
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={state.user.name}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={state.user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          User authentication will be available in the next version.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

export default Settings;