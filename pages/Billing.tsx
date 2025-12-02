import React from 'react';
import { BILLING_RULES, INVOICES } from '../services/mockData';
import { FileText, Settings, CreditCard, Download } from 'lucide-react';

const Billing: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Intro / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-md">
           <h3 className="text-slate-300 text-sm font-medium mb-1">סה״כ לחיוב (החודש)</h3>
           <div className="text-3xl font-bold">₪12,450.00</div>
           <div className="mt-4 flex items-center text-sm text-slate-400">
             <CreditCard size={16} className="ml-2" />
             <span>מחזור חיוב הבא: 01/06/2024</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing Rules Engine Visualization */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Settings className="text-blue-600" size={20} />
              מנוע חוקים דינמי
            </h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">ערוך חוקים</button>
          </div>
          
          <div className="space-y-4">
            {BILLING_RULES.map((rule) => (
              <div key={rule.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-slate-800">{rule.name}</div>
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                    {rule.fee_amount} {rule.currency}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-mono bg-slate-100 p-2 rounded w-fit">
                   <span className="text-purple-600">IF</span>
                   <span>{rule.trigger_event}</span>
                   <span className="text-purple-600">WHERE</span>
                   <span>{rule.condition}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="text-blue-600" size={20} />
            חשבוניות אחרונות
          </h3>
          
          <div className="overflow-hidden">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">מספר</th>
                  <th className="px-4 py-3">תקופה</th>
                  <th className="px-4 py-3">סכום</th>
                  <th className="px-4 py-3">סטטוס</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INVOICES.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-4 py-3 font-mono text-slate-600">{inv.id}</td>
                    <td className="px-4 py-3">{inv.period}</td>
                    <td className="px-4 py-3 font-bold">₪{inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inv.status === 'paid' ? 'שולם' : 'פתוח'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
