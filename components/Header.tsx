
import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';

interface HeaderProps {
  currentTab: AppState;
  onNavigate: (state: AppState) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });

  const navItems = [
    { label: 'Dashboard', state: AppState.DASHBOARD, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v2h14V5a1 1 0 00-1-1H4zM3 9v6a1 1 0 001 1h12a1 1 0 001-1V9H3z" /></svg> },
    { label: 'History', state: AppState.HISTORY, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg> },
    { label: 'Chat', state: AppState.CHAT, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6.414a1 1 0 00-.707.293L4 15.586V5z" /><path d="M5 7a1 1 0 00-2 0v7.586l1.293-1.293A1 1 0 015 12.586V7z" /></svg> },
    { label: 'Resources', state: AppState.RESOURCES, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg> },
  ];

  const handleNavigate = (state: AppState) => {
    onNavigate(state);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  const updateIndicator = (element: HTMLElement | null) => {
    if (element) {
      setIndicatorStyle({
        opacity: 1,
        left: element.offsetLeft,
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    } else {
      setIndicatorStyle({ ...indicatorStyle, opacity: 0 });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateIndicator(e.currentTarget);
  };

  const handleMouseLeave = () => {
    const activeTab = navRef.current?.querySelector(`[data-state="${currentTab}"]`) as HTMLElement;
    updateIndicator(activeTab);
  };

  useEffect(() => {
    const activeTab = navRef.current?.querySelector(`[data-state="${currentTab}"]`) as HTMLElement;
    updateIndicator(activeTab);
  }, [currentTab]);

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div 
          ref={navRef}
          className="hidden md:flex items-center bg-gray-800/80 backdrop-blur-lg p-2 rounded-full border border-gray-700/50 shadow-lg"
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="absolute bg-gray-700/80 rounded-full shadow-inner shadow-black/20 transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
          
          <div
            className="flex items-center space-x-3 cursor-pointer group z-10"
            onClick={() => handleNavigate(AppState.IDLE)}
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-400 p-2 rounded-full shadow-lg shadow-emerald-800/20 group-hover:scale-105 group-hover:shadow-emerald-700/30 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-400 tracking-tight">
              CropMate AI
            </span>
          </div>

          <div className="w-px h-6 bg-gray-700 mx-4 z-10"></div>

          {navItems.map((item) => {
            const isActive = currentTab === item.state;
            return (
              <button
                key={item.state}
                data-state={item.state}
                onClick={() => handleNavigate(item.state)}
                onMouseEnter={handleMouseEnter}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10"
              >
                <span className={isActive ? 'text-emerald-300' : 'text-gray-400'}>{item.icon}</span>
                <span className={isActive ? 'text-white' : 'text-gray-300'}>{item.label}</span>
              </button>
            );
          })}
          
          <div className="w-px h-6 bg-gray-700 mx-4 z-10"></div>
          
          <button
            onClick={handleLogoutClick}
            className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-400 hover:text-red-400 hover:bg-red-900/30 z-10"
          >
            Logout
          </button>
          <button
            onClick={() => handleNavigate(AppState.CAPTURING)}
            className="relative ml-2 bg-gradient-to-br from-emerald-500 to-teal-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg shadow-emerald-800/20 hover:shadow-2xl hover:shadow-emerald-800/30 hover:-translate-y-0.5 active:translate-y-0 z-10"
          >
            New Scan
          </button>
        </div>
      </header>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="p-3 bg-gray-800/80 backdrop-blur-lg text-white rounded-full transition-colors focus:outline-none shadow-lg"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Slide-in Drawer */}
      <div 
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-gray-900/80 backdrop-blur-lg border-l border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-6">
            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-white">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.state}
                  onClick={() => handleNavigate(item.state)}
                  className={`w-full flex items-center gap-4 text-left px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                    currentTab === item.state 
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/20' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-auto space-y-4 pt-6 border-t border-gray-800">
              <button
                onClick={() => handleNavigate(AppState.CAPTURING)}
                className="w-full bg-gradient-to-br from-emerald-500 to-teal-400 text-white px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-emerald-800/20 hover:shadow-2xl hover:shadow-emerald-800/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                New Scan
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full text-center px-4 py-3 rounded-xl text-lg font-medium transition-colors text-gray-400 hover:text-red-400 hover:bg-red-900/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
