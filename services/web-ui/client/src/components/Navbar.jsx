import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Menu, Search, Sun, Moon, User, Bell } from 'lucide-react';
import SearchModal from './SearchModal';

function Navbar() {
  const { state, dispatch } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    dispatch({ 
      type: 'SET_THEME', 
      payload: state.theme === 'light' ? 'dark' : 'light' 
    });
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu and Search */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Search bar */}
            <div className="relative">
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-64"
              >
                <Search className="h-4 w-4" />
                <span>Search stocks, news...</span>
              </button>
            </div>
          </div>

          {/* Right side - Time, Theme, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Current time */}
            <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
              {currentTime.toLocaleString()}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {state.theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block text-sm font-medium">
                  {state.user.name}
                </span>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {state.user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {state.user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      Preferences
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}

export default Navbar;