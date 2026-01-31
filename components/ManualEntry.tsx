
import React, { useState, useEffect, useRef } from 'react';
import { DraftOrder, OrderItem } from '../types';
import { MENU_ITEMS } from '../constants';

interface ManualEntryProps {
    initialNote: string;
    initialItems?: OrderItem[];
    initialPizzaDetails?: string;
    onNext: (draft: DraftOrder) => void;
    onCancel: () => void;
}

const CATEGORIES = ["Pizza", "Món Ăn Nhẹ", "Nước", "Combo", "Add - on"];

const ManualEntry: React.FC<ManualEntryProps> = ({ initialNote, initialItems = [], initialPizzaDetails, onNext, onCancel }) => {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    // Initialize cart from initialItems
    const [cart, setCart] = useState<{ [id: string]: number }>(() => {
        console.log("ManualEntry initializing with:", initialItems);
        const initialCart: { [id: string]: number } = {};
        if (initialItems && initialItems.length > 0) {
            initialItems.forEach((item: OrderItem) => {
                initialCart[item.id] = (initialCart[item.id] || 0) + item.quantity;
            });
        }
        console.log("Initial Cart state:", initialCart);
        return initialCart;
    });

    // Ensure cart updates if initialItems changes
    useEffect(() => {
        console.log("initialItems changed:", initialItems);
        const newCart: { [id: string]: number } = {};
        if (initialItems && initialItems.length > 0) {
            initialItems.forEach((item: OrderItem) => {
                newCart[item.id] = (newCart[item.id] || 0) + item.quantity;
            });
        }
        setCart(newCart);
    }, [initialItems]);

    const [note, setNote] = useState(initialNote);
    // Pizza Details state (read-only for local voice parse, but preserved for save)
    // We don't have UI to edit this yet, so we just pass it through.
    const [pizzaDetails, setPizzaDetails] = useState(initialPizzaDetails);

    // Voice Logic States
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Setup Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'vi-VN';

            recognitionRef.current.onresult = (event: any) => {
                let fullTranscript = '';
                for (let i = 0; i < event.results.length; ++i) {
                    fullTranscript += event.results[i][0].transcript;
                }
                if (fullTranscript) {
                    setNote(prev => fullTranscript); // Overwrite note with transcript
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                // Restart if error
                recognitionRef.current?.stop();
                setTimeout(() => {
                    recognitionRef.current?.start();
                    setIsListening(true);
                }, 100);
            }
        }
    };

    // Parse items from categories
    const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);

    const addToCart = (id: string) => {
        setCart(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => {
            const newCount = (prev[id] || 0) - 1;
            if (newCount <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: newCount };
        });
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.keys(cart).reduce((sum, id) => {
        const item = MENU_ITEMS.find(i => i.id === id);
        return sum + (item ? item.price * cart[id] : 0);
    }, 0);

    const handleContinue = () => {
        const orderItems: OrderItem[] = [];
        Object.keys(cart).forEach(id => {
            const item = MENU_ITEMS.find(i => i.id === id);
            if (item) {
                orderItems.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: cart[id]
                });
            }
        });

        onNext({
            table_number: "",
            note: note,
            items: orderItems,
            pizza_details: pizzaDetails
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col md:flex-row font-sans pb-24 md:pb-0 relative">
            {/* LEFT SIDE: MENU */}
            <div className="flex-1 flex flex-col w-full relative z-0">
                {/* Mobile Header */}
                <div className="sticky top-0 z-30 bg-white p-4 flex items-center justify-between shadow-sm border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-black italic tracking-tighter uppercase text-slate-900">Thực đơn</h2>
                    </div>
                    <button onClick={onCancel} className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition">
                        Quay lại
                    </button>
                </div>

                {/* Voice Note Area */}
                <div className="px-4 py-4 bg-white border-b border-slate-50">
                    <div className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${isListening ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                        <button
                            onClick={toggleListening}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isListening ? 'bg-red-600 text-white animate-pulse shadow-red-200 shadow-lg' : 'bg-white text-slate-600 shadow-sm border border-slate-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú món ăn..."
                            className="flex-1 bg-transparent text-sm font-bold text-slate-700 placeholder-slate-400 outline-none"
                        />
                        {note && <button onClick={() => setNote('')} className="text-[10px] font-bold text-slate-400 hover:text-red-500">XÓA</button>}
                    </div>
                </div>

                {/* Categories - Sticky below header */}
                <div className="sticky top-[73px] z-20 bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-slate-100 flex overflow-x-auto gap-2 no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all ${activeCategory === cat
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                                : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredItems.map(item => {
                        const qty = cart[item.id] || 0;
                        return (
                            <div
                                key={item.id}
                                onClick={() => addToCart(item.id)}
                                className={`relative p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all active:scale-[0.98] ${qty > 0 ? 'bg-red-50 border-red-500 shadow-md' : 'bg-white border-transparent shadow-sm hover:border-red-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-2">
                                        <h4 className={`font-black text-sm leading-tight mb-1 ${qty > 0 ? 'text-red-700' : 'text-slate-800'}`}>{item.name}</h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                                    </div>
                                    {qty > 0 && (
                                        <div className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-md animate-in zoom-in">
                                            {qty}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex items-end justify-between">
                                    <span className={`text-sm font-black ${qty > 0 ? 'text-red-600' : 'text-slate-900'}`}>{item.price.toLocaleString()}</span>
                                    <div className="flex gap-2">
                                        {qty > 0 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                                                className="w-8 h-8 rounded-full bg-white text-red-600 border border-red-200 flex items-center justify-center font-bold hover:bg-red-50"
                                            >
                                                -
                                            </button>
                                        )}
                                        <button className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors ${qty > 0 ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FLOATING BOTTOM BAR (DESKTOP & MOBILE) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng cộng ({totalItems} món)</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{totalPrice.toLocaleString()}đ</p>
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={totalItems === 0}
                        className="bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs shadow-lg shadow-red-200 active:scale-95 transition-all disabled:opacity-50 hover:bg-red-700"
                    >
                        Xác nhận đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManualEntry;
