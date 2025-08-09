import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewsFeed from './pages/NewsFeed';
import Analytics from './pages/Analytics';
import TradingSignals from './pages/TradingSignals';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/signals" element={<TradingSignals />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;