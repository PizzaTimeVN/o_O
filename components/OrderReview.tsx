
import React, { useState } from 'react';
import { DraftOrder, OrderItem } from '../types';

interface OrderReviewProps {
  draft: DraftOrder;
  onConfirm: (final: DraftOrder) => void;
  onCancel: () => void;
  onEdit: () => void;
}

const OrderReview: React.FC<OrderReviewProps> = ({ draft, onConfirm, onCancel, onEdit }) => {
  const [items, setItems] = useState<OrderItem[]>(draft.items);
  const [tableNumber, setTableNumber] = useState<string>(draft.table_number || '');
  const [note, setNote] = useState<string>(draft.note || '');

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const predefinedTables = ["1", "2", "3", "4", "5", "6", "7", "8", "Mang về"];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-red-50 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="bg-red-600 p-6 text-white">
        <h3 className="text-xl font-black italic tracking-tighter uppercase leading-tight text-center mb-1">Xác nhận đơn</h3>
        <p className="text-[10px] font-bold uppercase opacity-80 text-center mb-4">Chọn bàn & Kiểm tra món</p>

        <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-sm">
          <div className="grid grid-cols-5 gap-2 mb-2">
            {predefinedTables.map(t => (
              <button
                key={t}
                onClick={() => setTableNumber(t)}
                className={`col-span-1 py-2 rounded-xl text-xs font-black transition-all ${tableNumber === t
                  ? 'bg-white text-red-600 shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                {t}
              </button>
            ))}
            <input
              type="text"
              placeholder="#"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="col-span-1 bg-white/10 text-white placeholder-white/50 text-center rounded-xl p-0 text-xs font-black focus:ring-2 focus:ring-white border-none"
            />
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase opacity-60">Bàn đang chọn: </span>
            <span className="text-lg font-black bg-white text-red-600 px-3 py-0.5 rounded-lg ml-2">{tableNumber || '?'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
          {items.map(item => (
            <div key={item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="font-black text-slate-800 text-sm leading-tight uppercase tracking-tight flex-1 mr-2">{item.name}</p>
                <p className="font-bold text-red-500 text-xs">{(item.price * item.quantity).toLocaleString()}đ</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">{item.price.toLocaleString()}đ / món</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-red-600 font-black shadow-sm active:scale-90 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-black w-5 text-center text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-black shadow-lg active:scale-90 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center py-8 text-slate-400 font-bold italic">Chưa có món nào được chọn</p>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200 relative group transition-all hover:shadow-md hover:shadow-yellow-100">
          <label className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Ghi chú / Transcript
          </label>
          <textarea
            placeholder="Nội dung ghi âm hoặc ghi chú..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none resize-none placeholder-yellow-600/40 leading-relaxed"
            rows={2}
          />
        </div>

        <div className="pt-2">
          <button
            onClick={onEdit}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Chỉnh sửa / Chọn thêm món thủ công
          </button>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-between px-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng tiền:</span>
          <span className="text-2xl font-black text-red-600 tracking-tighter italic">{total.toLocaleString()}đ</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={onCancel}
            className="py-5 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm({ ...draft, table_number: tableNumber, note: note, items })}
            disabled={items.length === 0 || !tableNumber}
            className="py-5 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-100 disabled:opacity-50 active:scale-95 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            {tableNumber ? "Xác nhận lưu" : "Chọn bàn ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
