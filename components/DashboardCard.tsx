
import React from 'react';
import { Icon } from './shared/Icon';
import type { DashboardCardData } from '../types';

interface DashboardCardProps {
  data: DashboardCardData;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ data }) => {
  const { title, value, icon, change, changeType, color } = data;
  const isPositive = changeType === 'positive';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon name={icon} className="w-7 h-7 text-white" />
        </div>
        <div className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span>{change}</span>
          <Icon name={isPositive ? 'upArrow' : 'downArrow'} className="w-4 h-4 mr-1" />
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-md mt-4">{title}</p>
        <h2 className="text-3xl font-bold text-slate-800 mt-1">{value}</h2>
      </div>
    </div>
  );
};

export default DashboardCard;
