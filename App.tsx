
import React, { useState, useEffect } from 'react';
import { User } from './types';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import { supabaseService } from './services/supabaseService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('voice_order_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (username: string, password_hash: string, store_code: string) => {
    setLoading(true);
    setError(null);
    try {
      const authenticatedUser = await supabaseService.login(username, password_hash, store_code);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('voice_order_user', JSON.stringify(authenticatedUser));
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối database.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('voice_order_user');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {!user ? (
        <div className="relative">
          <AuthForm onLogin={handleLogin} />
          {loading && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="font-bold text-gray-700">Đang đăng nhập...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce text-sm font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
              <button onClick={() => setError(null)} className="ml-2 bg-white/20 hover:bg-white/30 rounded-full p-1 leading-none">×</button>
            </div>
          )}
        </div>
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
