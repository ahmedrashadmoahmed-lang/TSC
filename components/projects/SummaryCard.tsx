import React from 'react';
import { Icon } from '../shared/Icon';
import type { IconName } from '../../types';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: IconName;
  color: 'green' | 'red' | 'blue' | 'purple' | 'orange';
}

const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
  const classes = colorClasses[color];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full ${classes.bg}`}>
        <Icon name={icon} className={`w-6 h-6 ${classes.text}`} />
      </div>
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <h3 className="text-xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
};

export default SummaryCard;