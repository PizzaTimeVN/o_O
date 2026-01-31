
import React, { useState, useRef, useEffect } from 'react';
import { User, DraftOrder } from '../types';
import { parseVoiceCommandLocal } from '../services/localParser';

interface VoiceOrderProps {
  user: User;
  onParsed: (draft: DraftOrder) => void;
  isProcessingExternal: boolean;
}

const VoiceOrder: React.FC<VoiceOrderProps> = ({ user, onParsed, isProcessingExternal }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Tự động sửa các lỗi phổ biến
  const autoCorrect = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\b10 ý\b/gi, 'mì ý')
      .replace(/\bmười ý\b/gi, 'mì ý')
      .replace(/\bmi ý\b/gi, 'mì ý')
      .replace(/\bcom bo\b/gi, 'combo')
      .replace(/\bbộ số\b/gi, 'combo')
      .replace(/\bba rọi\b/gi, 'ba rọi xông khói')
      .replace(/\btrà đào\b/gi, 'trà đào')
      .replace(/\bđã me\b/gi, 'đá me')
      .replace(/\bđá mế\b/gi, 'đá me')
      .replace(/\btrà sữa\b/gi, 'trà sữa') // Bỏ "thái" để khớp keyword map
      .replace(/\btrà chanh\b/gi, 'trà chanh')
      .replace(/\bcoca\b/gi, 'nước ngọt')
      .replace(/\bpepsi\b/gi, 'nước ngọt')
      .replace(/\bsting\b/gi, 'nước ngọt')
      .replace(/\bbia\b/gi, 'local beer')
      .replace(/\bbeer\b/gi, 'local beer')
      .replace(/\bga te\b/gi, 'gà teriyaki');
  };

  useEffect(() => {
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
          setTranscript(autoCorrect(fullTranscript));
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error('Speech Recognition Error:', event.error);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    setTranscript('');
    setError(null);
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      recognitionRef.current?.stop();
      setTimeout(() => {
        recognitionRef.current?.start();
        setIsListening(true);
      }, 100);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const resetAll = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setIsProcessing(false);
    setTranscript('');
    setError(null);
  };

  const handleProcess = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    setError(null);
    try {
      const parsed = await parseVoiceCommandLocal(transcript);
      if (parsed.items && parsed.items.length > 0) {
        // Gán transcript vào note để người dùng đối chiếu
        parsed.note = transcript;
        onParsed(parsed);
        setTranscript('');
      } else {
        setError('Không tìm thấy món trong menu. Vui lòng nói rõ hơn (ví dụ: "1 pizza bò lớn").');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi phân tích.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`relative p-8 bg-white rounded-[3rem] border-2 transition-all duration-300 flex flex-col items-center justify-center ${isListening ? 'border-red-500 shadow-2xl' : 'border-slate-100 shadow-sm'}`}>

        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full bg-red-500/5 animate-pulse rounded-[3rem]"></div>
            <div className="absolute w-48 h-48 border-4 border-red-500/10 rounded-full animate-ping"></div>
          </div>
        )}

        <div className="relative z-10">
          {!isListening && !isProcessing && !isProcessingExternal ? (
            <button
              onClick={startListening}
              className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-2xl hover:bg-black active:scale-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          ) : isListening ? (
            <button
              onClick={stopListening}
              className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl animate-pulse"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
              <div className="w-10 h-10 border-[5px] border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-1/2 w-full animate-[bounce_1s_infinite] pointer-events-none"></div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center z-10">
          <h4 className={`text-xl font-black italic tracking-tighter uppercase ${isListening ? 'text-red-600' : 'text-slate-900'}`}>
            {isListening ? 'ĐANG GHI ÂM...' : isProcessing || isProcessingExternal ? 'ĐANG PHÂN TÍCH...' : 'BẤM ĐỂ ĐỌC ĐƠN'}
          </h4>
        </div>
      </div>

      {(transcript || isListening) && (
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-xl animate-in slide-in-from-bottom-5 duration-500 relative overflow-hidden">
          {isProcessing && (
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
              <div className="h-full bg-red-600 animate-[progress_0.8s_ease-in-out_infinite] w-1/3"></div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Nội dung đơn hàng:</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase italic">Có thể sửa trực tiếp</span>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={isProcessing}
            placeholder="Nội dung sẽ hiện ở đây khi bạn nói..."
            className="w-full bg-slate-50 border-0 rounded-2xl p-5 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-red-100 outline-none transition-all min-h-[120px] resize-none leading-relaxed italic disabled:opacity-50"
          />

          {!isListening && !isProcessing && transcript && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={resetAll}
                className="flex-1 bg-slate-100 py-4 rounded-xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-colors"
              >
                Xóa
              </button>
              <button
                onClick={handleProcess}
                className="flex-[2] bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Xác nhận & Lên đơn
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in text-[11px] font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
};

export default VoiceOrder;
