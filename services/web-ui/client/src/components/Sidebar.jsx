import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart3, 
  Newspaper, 
  TrendingUp, 
  Signal, 
  Settings, 
  ChevronLeft,
  Activity
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'News Feed', href: '/news', icon: Newspaper },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Trading Signals', href: '/signals', icon: Signal },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function Sidebar() {
  const { state, dispatch } = useAppContext();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!state.sidebarCollapsed && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: true })}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-30 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300
        ${state.sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center space-x-3 ${state.sidebarCollapsed ? 'lg:justify-center' : ''}`}>
            <Activity className="h-8 w-8 text-primary-600" />
            {!state.sidebarCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Gemini
              </h1>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                    ${state.sidebarCollapsed ? 'lg:justify-center' : ''}
                  `}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: true });
                    }
                  }}
                >
                  <Icon className={`h-5 w-5 ${!state.sidebarCollapsed ? 'mr-3' : ''}`} />
                  {!state.sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse button for desktop */}
        <div className="absolute bottom-6 left-3 right-3 hidden lg:block">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${state.sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!state.sidebarCollapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;