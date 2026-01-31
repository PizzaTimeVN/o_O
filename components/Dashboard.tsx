
import React, { useState } from 'react';
import { User, Order, DraftOrder } from '../types';
import VoiceOrder from './VoiceOrder';
import OrderReview from './OrderReview';
import ManualEntry from './ManualEntry';
import { supabaseService } from '../services/supabaseService';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [draftOrder, setDraftOrder] = useState<DraftOrder | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleParsed = (draft: DraftOrder) => {
    setDraftOrder(draft);
  };

  const handleManualNext = (draft: DraftOrder) => {
    setDraftOrder(draft);
    setIsManualMode(false);
  };

  const handleConfirmOrder = async (finalOrder: DraftOrder) => {
    setIsSyncing(true);
    try {
      const itemsMap: Record<string, number> = {};
      let calculatedTotal = 0;

      finalOrder.items.forEach(item => {
        itemsMap[item.id] = item.quantity;
        calculatedTotal += (item.price * item.quantity);
      });

      const newOrder: Order = {
        id: Date.now(),
        store_code: user.store_code,
        user_id: user.username,
        order_type: 'dine_in',
        table_number: finalOrder.table_number,
        note: finalOrder.note || '',
        pizza_details: finalOrder.pizza_details, // Save details
        items: JSON.stringify(itemsMap),
        total: calculatedTotal,
        payment_method: '', // Để trống phương thức thanh toán theo yêu cầu
        status: 'pending',
        created_at: new Date().toISOString(),
        order_source: 'staff'
      };

      await supabaseService.createOrder(newOrder);
      setDraftOrder(null);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2000);
    } catch (error: any) {
      console.error("Order save error:", error);
      alert(error.message || "Lỗi lưu đơn hàng.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col font-sans bg-slate-50">
      {/* ... header same ... */}
      <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-red-200 -rotate-3">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-black text-gray-900 text-lg tracking-tighter leading-none italic uppercase">PIZZA TIME</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{user.store_code} • {user.username}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      <main className="flex-1 p-6">
        {successMsg && (
          <div className="mb-6 bg-green-500 text-white p-4 rounded-2xl flex items-center justify-center gap-2 animate-in slide-in-from-top duration-500 shadow-lg shadow-green-100">
            {/* ... success icon same ... */}
            <span className="font-black uppercase tracking-widest text-[10px]">ĐÃ LƯU ĐƠN HÀNG!</span>
          </div>
        )}

        {draftOrder ? (
          isManualMode ? (
            <ManualEntry
              initialNote={draftOrder.note || ""}
              initialItems={draftOrder.items}
              initialPizzaDetails={draftOrder.pizza_details}
              onNext={handleManualNext}
              onCancel={() => setIsManualMode(false)}
            />
          ) : (
            <OrderReview
              draft={draftOrder}
              onConfirm={handleConfirmOrder}
              onCancel={() => setDraftOrder(null)}
              onEdit={() => setIsManualMode(true)}
            />
          )
        ) : isManualMode ? (
          <ManualEntry
            initialNote=""
            onNext={handleManualNext}
            onCancel={() => setIsManualMode(false)}
          />
        ) : (
          <div className="h-full flex flex-col justify-center animate-in fade-in duration-500">
            <div className="text-center mb-8">
              {/* ... icon ... */}
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-slate-800 font-black text-lg tracking-tight mb-2">ĐỌC ĐƠN HÀNG</h3>
              <p className="text-slate-400 text-xs font-medium px-10 leading-relaxed">Ví dụ: <span className="text-red-400">"2 pizza bò lớn, 1 trà đào"</span></p>
              <div className="mt-4">
                <button
                  onClick={() => setIsManualMode(true)}
                  className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200 pb-0.5 hover:text-red-500 hover:border-red-500 transition-colors"
                >
                  Hoặc chọn món thủ công
                </button>
              </div>
            </div>
            <VoiceOrder
              user={user}
              onParsed={handleParsed}
              isProcessingExternal={isSyncing}
            />
          </div>
        )}
      </main>

      <footer className="p-6 text-center">
        {/* ... footer ... */}
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">AI Order v3.0 • Smart Parser</p>
      </footer>
    </div>
  );
};

export default Dashboard;
