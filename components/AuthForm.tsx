
import React, { useState } from 'react';
import { STORES } from '../constants';

interface LoginFormProps {
  onLogin: (username: string, password_hash: string, store: string) => void;
}

const AuthForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [store, setStore] = useState(STORES[0].code);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password, store);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-red-600 mb-2 tracking-tighter italic">PIZZA TIME</h1>
          <p className="text-gray-400 font-medium">Hệ thống nhận đơn tại bàn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase mb-1 ml-1">Tên đăng nhập</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition font-medium"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase mb-1 ml-1">Mật khẩu</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase mb-1 ml-1">Chọn quán làm việc</label>
            <div className="grid grid-cols-2 gap-2">
              {STORES.map(s => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => setStore(s.code)}
                  className={`py-3 rounded-xl border text-sm font-bold transition ${store === s.code
                      ? 'bg-red-600 border-red-600 text-white shadow-md'
                      : 'bg-white border-gray-100 text-gray-500 hover:border-red-200'
                    }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-lg transition transform active:scale-[0.98] mt-4 uppercase tracking-wider"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
