
import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  currentTab: AppState;
  onNavigate: (state: AppState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { label: 'Dashboard', state: AppState.DASHBOARD },
    { label: 'History', state: AppState.HISTORY },
    { label: 'Chat', state: AppState.CHAT },
    { label: 'Resources', state: AppState.RESOURCES },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onNavigate(AppState.IDLE)}
        >
          <div className="bg-emerald-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">
            AgroVision AI
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <button
              key={item.state}
              onClick={() => onNavigate(item.state)}
              className={`text-sm font-medium transition-colors ${
                currentTab === item.state ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        
        <button 
          onClick={() => onNavigate(AppState.CAPTURING)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-md shadow-emerald-200"
        >
          New Scan
        </button>
      </div>
    </header>
  );
};

export default Header;
