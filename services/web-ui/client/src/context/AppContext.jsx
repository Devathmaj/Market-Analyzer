import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  theme: 'light',
  selectedStock: 'AAPL',
  watchlist: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
  apiKey: '',
  user: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  sidebarCollapsed: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SELECTED_STOCK':
      return { ...state, selectedStock: action.payload };
    case 'ADD_TO_WATCHLIST':
      return { 
        ...state, 
        watchlist: [...state.watchlist, action.payload].filter((item, index, arr) => arr.indexOf(item) === index)
      };
    case 'REMOVE_FROM_WATCHLIST':
      return { 
        ...state, 
        watchlist: state.watchlist.filter(stock => stock !== action.payload)
      };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedApiKey = localStorage.getItem('apiKey');
    const savedWatchlist = localStorage.getItem('watchlist');

    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
    if (savedApiKey) {
      dispatch({ type: 'SET_API_KEY', payload: savedApiKey });
    }
    if (savedWatchlist) {
      const watchlist = JSON.parse(savedWatchlist);
      watchlist.forEach(stock => {
        dispatch({ type: 'ADD_TO_WATCHLIST', payload: stock });
      });
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  // Save API key to localStorage
  useEffect(() => {
    localStorage.setItem('apiKey', state.apiKey);
  }, [state.apiKey]);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
  }, [state.watchlist]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}