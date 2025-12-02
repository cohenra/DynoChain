import React from 'react';
import { Package, Truck, Receipt, LayoutDashboard, Settings, Bot, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleAI: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, toggleAI }) => {
  const menuItems = [
    { id: 'dashboard', label: 'לוח בקרה', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'קטלוג מוצרים', icon: <Database size={20} /> },
    { id: 'inbound', label: 'קבלת סחורה', icon: <Truck size={20} /> },
    { id: 'inventory', label: 'ניהול מלאי', icon: <Package size={20} /> },
    { id: 'billing', label: 'חיובים וחוזים', icon: <Receipt size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-50 flex flex-col h-screen fixed inset-y-0 right-0 z-10">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">L</div>
        <span className="text-xl font-bold tracking-tight">LogiSnap</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
         <button
            onClick={toggleAI}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-opacity"
          >
            <Bot size={20} />
            <span>סוכן AI</span>
          </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium">
          <Settings size={20} />
          <span>הגדרות</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;