import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Inbound from './pages/Inbound';
import Billing from './pages/Billing';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { generateAIResponse } from './services/geminiService';
import { ChatMessage } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // AI State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'שלום! אני LogiBot. איך אני יכול לעזור בניהול המחסן היום?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const aiResponseText = await generateAIResponse(userMsg.text);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'inbound': return <Inbound />;
      case 'billing': return <Billing />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Sidebar - Fixed Right */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} toggleAI={() => setIsAIOpen(!isAIOpen)} />

      {/* Main Content Area - Padded Right to account for Sidebar */}
      <main className="min-h-screen mr-64 transition-all duration-300">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {activeTab === 'dashboard' && 'לוח בקרה'}
            {activeTab === 'inventory' && 'ניהול מלאי'}
            {activeTab === 'inbound' && 'קבלת סחורה (Inbound)'}
            {activeTab === 'billing' && 'חיובים וחוזים'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">משתמש: ישראל ישראלי (מנהל מחסן)</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              י
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* AI Assistant Drawer/Popup */}
      {isAIOpen && (
        <div className="fixed bottom-6 left-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">LogiBot AI</span>
            </div>
            <button onClick={() => setIsAIOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
               <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-sm text-slate-500">
                 <Loader2 size={16} className="animate-spin" />
                 <span>חושב...</span>
               </div>
             </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-200">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="שאל את ה-AI שאלה על המלאי..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="absolute left-1 top-1 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
