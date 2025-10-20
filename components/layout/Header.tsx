
import React from 'react';
import { Icon } from '../shared/Icon';

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  return (
    <header className="flex justify-between items-center p-6 bg-white border-b border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
      <div className="flex items-center space-x-reverse space-x-4">
        <div className="relative">
          <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
          <input
            type="text"
            placeholder="بحث..."
            className="bg-slate-100 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-slate-100 transition">
          <Icon name="notification" className="w-6 h-6 text-slate-500" />
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 transition">
          <Icon name="settings" className="w-6 h-6 text-slate-500" />
        </button>
      </div>
    </header>
  );
};

export default Header;
