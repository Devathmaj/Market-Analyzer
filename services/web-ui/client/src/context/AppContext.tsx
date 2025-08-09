import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType, UserSettings } from '../types';

const defaultSettings: UserSettings = {
  theme: 'light',
  apiKey: '',
  preferredStocks: ['AAPL', 'GOOGL', 'MSFT'],
  notifications: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
  };

  const value: AppContextType = {
    settings,
    updateSettings,
    selectedStock,
    setSelectedStock,
    isLoading,
    setIsLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};