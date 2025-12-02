import React, { useState, useEffect } from 'react';
import { getInventoryWithDetails } from '../services/mockData';
import { InventoryItem } from '../types';
import { LayoutGrid, List, Search, Filter, ChevronDown, ChevronUp, MoreHorizontal, Box } from 'lucide-react';

const Inventory: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [data, setData] = useState<InventoryItem[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    setData(getInventoryWithDetails());
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="חיפוש לפי מק״ט, שם מוצר או ברקוד..." 
            className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={18} />
            <span>סינון</span>
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">מק״ט</th>
                <th className="px-6 py-3">שם מוצר</th>
                <th className="px-6 py-3">מיקום</th>
                <th className="px-6 py-3">כמות</th>
                <th className="px-6 py-3">סטטוס</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <React.Fragment key={item.id}>
                  <tr 
                    onClick={() => toggleRow(item.id)}
                    className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${expandedRow === item.id ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">{item.product?.sku}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                            <Box size={16} className="text-slate-500" />
                         </div>
                         {item.product?.name}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{item.location?.name}</td>
                    <td className="px-6 py-3 font-mono">{item.quantity}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-700' :
                        item.status === 'quarantine' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status === 'active' ? 'פעיל' : item.status === 'quarantine' ? 'הסגר' : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-400">
                      {expandedRow === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  {expandedRow === item.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={6} className="px-6 py-4">
                         <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">פרטי מוצר נוספים</h4>
                                <div className="space-y-1 text-slate-700">
                                    <p><span className="text-slate-500">ברקוד:</span> {item.product?.barcode}</p>
                                    <p><span className="text-slate-500">מידות:</span> {item.product?.dimensions}</p>
                                    <p><span className="text-slate-500">תוקף:</span> {item.expiry_date}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">מאפיינים דינמיים (JSON)</h4>
                                <div className="space-y-1 text-slate-700">
                                    {item.product?.custom_attributes && Object.entries(item.product.custom_attributes).map(([key, val]) => (
                                        <p key={key}><span className="text-slate-500">{key}:</span> {val.toString()}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-end justify-end">
                                <button className="text-blue-600 text-sm font-medium hover:underline">ערוך פריט</button>
                                <span className="mx-2 text-slate-300">|</span>
                                <button className="text-blue-600 text-sm font-medium hover:underline">היסטוריית תנועות</button>
                            </div>
                         </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-3">
                   <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                       <Box size={24} />
                   </div>
                   <button className="text-slate-400 hover:text-slate-600">
                       <MoreHorizontal size={20} />
                   </button>
               </div>
               <h3 className="font-semibold text-slate-900">{item.product?.name}</h3>
               <p className="text-sm text-slate-500 mb-4">{item.product?.sku}</p>
               
               <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                   <div className="flex flex-col">
                       <span className="text-slate-500 text-xs">כמות</span>
                       <span className="font-bold">{item.quantity}</span>
                   </div>
                   <div className="flex flex-col text-left">
                       <span className="text-slate-500 text-xs">מיקום</span>
                       <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">{item.location?.name}</span>
                   </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
