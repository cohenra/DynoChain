import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts, createProduct } from '../services/api';
import { PRODUCTS } from '../services/mockData';
import { Plus, Search, Filter, Snowflake, Shield, Tag, Box, Info } from 'lucide-react';

const ProductMaster: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    barcode: '',
    dimensions: '',
    tracking_type: 'NONE',
    
    // Dynamic JSONB Logic
    behavior_rules: {
      storage_condition: 'AMBIENT',
      hazmat_class: 'NONE',
      capture_weight: false,
      receiving_workflow: {
        requires_quality_check: false,
        vas_labeling: 'NONE',
        giur_process: false
      }
    }
  });

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      console.error("Failed to load products from API, using mock.", e);
      setProducts(PRODUCTS); // Fallback so UI is visible
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async () => {
    try {
      // Map form state to the flat Product structure expected by backend API (which nests custom_attributes)
      await createProduct({
        sku: formData.sku,
        name: formData.name,
        barcode: formData.barcode,
        dimensions: formData.dimensions,
        custom_attributes: {
            ...formData.behavior_rules,
            tracking_type: formData.tracking_type 
        }
      } as any);
      
      setIsModalOpen(false);
      loadProducts(); // Refresh
      // Reset form
      setFormData({
        sku: '', name: '', barcode: '', dimensions: '', tracking_type: 'NONE',
        behavior_rules: {
          storage_condition: 'AMBIENT', hazmat_class: 'NONE', capture_weight: false,
          receiving_workflow: { requires_quality_check: false, vas_labeling: 'NONE', giur_process: false }
        }
      });
    } catch (e) {
      alert('Failed to create product. API might be offline.');
    }
  };

  // Helper to handle nested JSON updates
  const updateBehavior = (path: string, value: any) => {
    setFormData(prev => {
        const newRules = { ...prev.behavior_rules };
        // Simple manual deep set for the defined structure
        if (path === 'receiving_workflow.giur_process') newRules.receiving_workflow.giur_process = value;
        else if (path === 'receiving_workflow.requires_quality_check') newRules.receiving_workflow.requires_quality_check = value;
        else if (path === 'receiving_workflow.vas_labeling') newRules.receiving_workflow.vas_labeling = value;
        else if (path === 'storage_condition') newRules.storage_condition = value;
        else if (path === 'hazmat_class') newRules.hazmat_class = value;
        else if (path === 'capture_weight') newRules.capture_weight = value;
        
        return { ...prev, behavior_rules: newRules };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header / Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="חיפוש בקטלוג..." 
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200">
            <Filter size={20} />
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors"
        >
          <Plus size={20} />
          <span>מוצר חדש</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">מק״ט</th>
              <th className="px-6 py-3">שם מוצר</th>
              <th className="px-6 py-3">ברקוד</th>
              <th className="px-6 py-3">מעקב</th>
              <th className="px-6 py-3">מאפייני אחסון</th>
              <th className="px-6 py-3">הוראות קליטה (VAS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
                <tr><td colSpan={6} className="p-6 text-center">טוען קטלוג...</td></tr>
            ) : products.map((p) => {
                // Parse dynamic attrs safely
                const attrs = p.custom_attributes || {};
                const workflow = (attrs.receiving_workflow as any) || {};
                
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">{p.sku}</td>
                    <td className="px-6 py-3">{p.name}</td>
                    <td className="px-6 py-3 font-mono text-slate-500">{p.barcode}</td>
                    <td className="px-6 py-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                            {attrs.tracking_type || 'רגיל'}
                        </span>
                    </td>
                    <td className="px-6 py-3">
                        <div className="flex gap-2">
                            {attrs.storage_condition === 'FROZEN' && (
                                <span title="מקפיא" className="bg-blue-100 text-blue-600 p-1 rounded"><Snowflake size={16}/></span>
                            )}
                            {attrs.hazmat_class !== 'NONE' && attrs.hazmat_class && (
                                <span title="חומ״ס" className="bg-orange-100 text-orange-600 p-1 rounded"><Shield size={16}/></span>
                            )}
                            {(!attrs.storage_condition || attrs.storage_condition === 'AMBIENT') && (!attrs.hazmat_class || attrs.hazmat_class === 'NONE') && (
                                <span className="text-slate-400 text-xs">-</span>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-3">
                        <div className="flex gap-2 flex-wrap">
                            {workflow.giur_process && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200">גיור</span>
                            )}
                            {workflow.requires_quality_check && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">בקרת איכות</span>
                            )}
                            {workflow.vas_labeling && workflow.vas_labeling !== 'NONE' && (
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">מדבקת יבואן</span>
                            )}
                        </div>
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">הקמת פריט חדש</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
                {/* 1. Basic Info */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Box size={16} />
                        פרטים בסיסיים
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">מק״ט (SKU)</label>
                            <input 
                                value={formData.sku}
                                onChange={e => setFormData({...formData, sku: e.target.value})}
                                type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="לדוג׳: LGS-100" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">שם מוצר</label>
                            <input 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ברקוד (EAN)</label>
                            <input 
                                value={formData.barcode}
                                onChange={e => setFormData({...formData, barcode: e.target.value})}
                                type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">סוג מעקב</label>
                            <select 
                                value={formData.tracking_type}
                                onChange={e => setFormData({...formData, tracking_type: e.target.value})}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="NONE">ללא (כמות בלבד)</option>
                                <option value="SERIAL">סריאלי (S/N)</option>
                                <option value="BATCH">אצוות (Batch + Exp)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-slate-100" />

                {/* 2. Logic Engine */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Tag size={16} />
                        מנוע חוקים (Smart SKU)
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                        {/* Storage Logic */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="font-semibold text-slate-700 mb-3 text-sm">תנאי אחסון</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">טמפרטורה</label>
                                    <select 
                                        value={formData.behavior_rules.storage_condition}
                                        onChange={e => updateBehavior('storage_condition', e.target.value)}
                                        className="w-full text-sm p-2 border border-slate-300 rounded-md"
                                    >
                                        <option value="AMBIENT">רגיל (יבש)</option>
                                        <option value="COOLED">קירור (4°C)</option>
                                        <option value="FROZEN">הקפאה (-18°C)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">חומרים מסוכנים</label>
                                    <select 
                                        value={formData.behavior_rules.hazmat_class}
                                        onChange={e => updateBehavior('hazmat_class', e.target.value)}
                                        className="w-full text-sm p-2 border border-slate-300 rounded-md"
                                    >
                                        <option value="NONE">ללא</option>
                                        <option value="FLAMMABLE">דליק</option>
                                        <option value="CORROSIVE">מעכל</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Receiving Workflow */}
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <h4 className="font-semibold text-indigo-900 mb-3 text-sm flex items-center gap-2">
                                <Info size={14}/>
                                הוראות קליטה (VAS)
                            </h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.behavior_rules.receiving_workflow.giur_process}
                                        onChange={e => updateBehavior('receiving_workflow.giur_process', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-slate-700">תהליך גיור (הפרדה)</span>
                                </label>

                                <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.behavior_rules.receiving_workflow.requires_quality_check}
                                        onChange={e => updateBehavior('receiving_workflow.requires_quality_check', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-slate-700">בקרת איכות חובה</span>
                                </label>
                                
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">הדבקת תווית (VAS)</label>
                                    <select 
                                        value={formData.behavior_rules.receiving_workflow.vas_labeling}
                                        onChange={e => updateBehavior('receiving_workflow.vas_labeling', e.target.value)}
                                        className="w-full text-sm p-2 border border-indigo-200 rounded-md bg-white"
                                    >
                                        <option value="NONE">ללא</option>
                                        <option value="IMPORTER_STICKER">מדבקת יבואן</option>
                                        <option value="PRICE_TAG">תווית מחיר</option>
                                        <option value="WARRANTY">תעודת אחריות</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl sticky bottom-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">ביטול</button>
                <button onClick={handleCreate} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    שמור פריט
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMaster;