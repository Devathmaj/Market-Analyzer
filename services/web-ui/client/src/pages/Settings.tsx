import React, { useState } from 'react';
import { Save, Moon, Sun, Key, Bell, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { UserSettings } from '../types';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [newStock, setNewStock] = useState('');

  const handleSave = () => {
    updateSettings(localSettings);
    // Show success message (in a real app, you might want to use a toast notification)
    alert('Settings saved successfully!');
  };

  const handleThemeToggle = () => {
    const newTheme = localSettings.theme === 'light' ? 'dark' : 'light';
    const updatedSettings: UserSettings = { ...localSettings, theme: newTheme };
    setLocalSettings(updatedSettings);
    updateSettings(updatedSettings); // Apply immediately for better UX
  };

  const addPreferredStock = () => {
    if (newStock && !localSettings.preferredStocks.includes(newStock.toUpperCase())) {
      setLocalSettings({
        ...localSettings,
        preferredStocks: [...localSettings.preferredStocks, newStock.toUpperCase()]
      });
      setNewStock('');
    }
  };

  const removePreferredStock = (stock: string) => {
    setLocalSettings({
      ...localSettings,
      preferredStocks: localSettings.preferredStocks.filter((s: string) => s !== stock)
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card title="Appearance">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {localSettings.theme === 'light' ? (
                  <Sun className="text-yellow-500" size={20} />
                ) : (
                  <Moon className="text-blue-500" size={20} />
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.theme === 'dark' ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* API Configuration */}
        <Card title="API Configuration">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Key className="text-gray-400 mt-1" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={localSettings.apiKey}
                  onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="text-gray-400" size={20} />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive alerts for trading signals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLocalSettings({ ...localSettings, notifications: { ...localSettings.notifications, priceAlerts: !localSettings.notifications.priceAlerts } })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications.priceAlerts ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications.priceAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Preferred Stocks */}
        <Card title="Preferred Stocks">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Stock Symbol
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value.toUpperCase())}
                    placeholder="e.g., AAPL"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={addPreferredStock}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Preferred Stocks:</h4>
              <div className="flex flex-wrap gap-2">
                {localSettings.preferredStocks.map((stock: string) => (
                  <span
                    key={stock}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  >
                    {stock}
                    <button
                      onClick={() => removePreferredStock(stock)}
                      className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Save size={20} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;