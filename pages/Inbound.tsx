import React, { useState } from 'react';
import { INBOUND_ORDERS } from '../services/mockData';
import { PackageCheck, Calendar, Truck, ArrowRight } from 'lucide-react';

const Inbound: React.FC = () => {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(INBOUND_ORDERS[0].id);

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Left List (Actually Right because RTL) */}
      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">הזמנות רכש (Inbound)</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {INBOUND_ORDERS.map((order) => (
            <div 
              key={order.id}
              onClick={() => setActiveOrderId(order.id)}
              className={`p-4 rounded-lg cursor-pointer border transition-all ${
                activeOrderId === order.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200' 
                  : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-800">#{order.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                  order.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-slate-100'
                }`}>
                  {order.status === 'pending' ? 'ממתין' : 'התקבל'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <Truck size={14} />
                <span>{order.supplier_name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={12} />
                <span>צפי: {order.expected_date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Details Panel */}
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {activeOrderId ? (
          <>
             {(() => {
                const order = INBOUND_ORDERS.find(o => o.id === activeOrderId);
                if (!order) return null;
                return (
                   <div className="flex-1 flex flex-col">
                      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                          <div>
                              <h2 className="text-2xl font-bold text-slate-800 mb-1">הזמנה #{order.id}</h2>
                              <p className="text-slate-500">ספק: {order.supplier_name}</p>
                          </div>
                          {order.status === 'pending' && (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors">
                                  <PackageCheck size={18} />
                                  <span>קבל סחורה</span>
                              </button>
                          )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                            <BoxIcon />
                            <span>פריטים בהזמנה</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-slate-100 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">שם מוצר</th>
                                        <th className="px-4 py-3">כמות צפויה</th>
                                        <th className="px-4 py-3">כמות שהתקבלה</th>
                                        <th className="px-4 py-3">סטטוס שורה</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {order.items.map(item => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 font-medium">{item.product_name}</td>
                                            <td className="px-4 py-3">{item.expected_qty}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {item.received_qty}
                                                    {item.received_qty < item.expected_qty && (
                                                        <span className="text-xs text-orange-600 bg-orange-50 px-1 rounded">(חסר)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.received_qty === item.expected_qty 
                                                    ? <span className="text-green-600 flex items-center gap-1"><CheckCircleIcon /> הושלם</span> 
                                                    : <span className="text-slate-400">פתוח</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                      </div>
                      
                      <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
                          <h4 className="font-semibold text-slate-700 mb-2">לוג פעילות</h4>
                          <div className="text-sm text-slate-500 space-y-1">
                              <p>• ההזמנה נוצרה על ידי המערכת (10/05/2024 09:00)</p>
                              <p>• נשלח מייל אישור לספק (10/05/2024 09:05)</p>
                          </div>
                      </div>
                   </div>
                );
             })()}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            בחר הזמנה לצפייה בפרטים
          </div>
        )}
      </div>
    </div>
  );
};

// Simple icons for this component
const BoxIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const CheckCircleIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default Inbound;
