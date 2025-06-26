
import React from 'react';
import { AppView } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { SunIcon } from './icons/SunIcon';


interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onAddActivityClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onAddActivityClick }) => {
  const navItems = [
    { view: 'today' as AppView, label: 'Today', icon: <SunIcon className="w-5 h-5 mr-2" /> },
    { view: 'all' as AppView, label: 'All Activities', icon: <ListBulletIcon className="w-5 h-5 mr-2" /> },
    { view: 'analytics' as AppView, label: 'Analytics', icon: <ChartPieIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <header className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <CalendarDaysIcon className="h-10 w-10 text-primary-light mr-3" />
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Activity<span className="text-primary-light">Scheduler</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-2">
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150
                  ${currentView === item.view 
                    ? 'bg-primary-dark text-white shadow-md' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={onAddActivityClick}
            className="hidden md:flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 transform hover:scale-105"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Activity
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-around p-2 bg-slate-700 rounded-b-lg">
            {navItems.map(item => (
              <button
                key={`mobile-${item.view}`}
                onClick={() => setCurrentView(item.view)}
                className={`flex flex-col items-center p-2 rounded-md text-xs font-medium transition-colors duration-150
                  ${currentView === item.view 
                    ? 'bg-primary-dark text-white' 
                    : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                  }`}
              >
                {React.cloneElement(item.icon, { className: "w-5 h-5 mb-1"})}
                {item.label}
              </button>
            ))}
          </nav>
      </div>
    </header>
  );
};

export default Header;
    