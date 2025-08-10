import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, UserSettings } from '../types';

const defaultSettings: UserSettings = {
  theme: 'light',
  apiKey: '',
  preferredStocks: ['AAPL', 'GOOGL', 'MSFT'],
  notifications: {
    priceAlerts: true,
    newsAlerts: true,
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load settings from localStorage on client-side mount
  useEffect(() => {
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

  // Apply theme and save settings on client-side
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
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
