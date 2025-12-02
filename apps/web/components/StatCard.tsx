import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          <span>{trend}</span>
          <span className="ms-1 text-slate-400">מהחודש שעבר</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;