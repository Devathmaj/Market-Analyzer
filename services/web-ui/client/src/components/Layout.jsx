import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children }) {
  const { state } = useAppContext();

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop - keep sidebar open
        if (state.sidebarCollapsed) {
          // Don't auto-expand on desktop
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.sidebarCollapsed]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;