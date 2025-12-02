import React from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'א', received: 400, shipped: 240 },
  { name: 'ב', received: 300, shipped: 139 },
  { name: 'ג', received: 200, shipped: 980 },
  { name: 'ד', received: 278, shipped: 390 },
  { name: 'ה', received: 189, shipped: 480 },
  { name: 'ו', received: 239, shipped: 380 },
  { name: 'ש', received: 349, shipped: 430 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="סה״כ מלאי (יחידות)" 
          value="14,250" 
          icon={<Package size={24} />} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          title="הזמנות פתוחות" 
          value="23" 
          icon={<TrendingUp size={24} />} 
          trend="+5%" 
          trendUp={true} 
        />
        <StatCard 
          title="פריטים בהסגר" 
          value="150" 
          icon={<AlertTriangle size={24} />} 
          trend="-2%" 
          trendUp={false} 
        />
        <StatCard 
          title="הכנסות צפויות (חודשי)" 
          value="₪45,200" 
          icon={<DollarSign size={24} />} 
          trend="+8%" 
          trendUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">תנועות מלאי (שבועי)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="received" name="התקבל" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shipped" name="נשלח" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts / Activity Feed */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">התראות מערכת</h3>
          <div className="space-y-4">
            {[
              { text: 'מלאי נמוך: Wireless Headphones', time: 'לפני 10 דק׳', type: 'warning' },
              { text: 'משלוח חדש התקבל: Global Imports', time: 'לפני 45 דק׳', type: 'info' },
              { text: 'שגיאת מערכת בחישוב עמלות', time: 'לפני שעה', type: 'error' },
              { text: 'משתמש חדש נוצר: דני כהן', time: 'לפני שעתיים', type: 'success' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  alert.type === 'warning' ? 'bg-orange-500' :
                  alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-800">{alert.text}</p>
                  <p className="text-xs text-slate-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;