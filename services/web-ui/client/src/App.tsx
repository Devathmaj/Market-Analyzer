import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewsFeed from './pages/NewsFeed';
import Analytics from './pages/Analytics';
import TradingSignals from './pages/TradingSignals';
import Settings from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

          {/* Main Content */}
          <div className="lg:pl-64">
            {/* Top Navbar */}
            <Navbar onToggleSidebar={toggleSidebar} />

            {/* Page Content */}
            <main className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/news" element={<NewsFeed />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/signals" element={<TradingSignals />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;