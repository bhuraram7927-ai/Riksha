import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  User, 
  Sparkles, 
  CheckCheck, 
  ShieldCheck 
} from 'lucide-react';
import { DriverInfo, Language } from '../types';
import { QUICK_CHAT_MESSAGES, DRIVER_CHAT_RESPONSES } from '../data/mockData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  timestamp: string;
}

interface ChatDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverInfo;
  language: Language;
}

export const ChatDriverModal: React.FC<ChatDriverModalProps> = ({
  isOpen,
  onClose,
  driver,
  language
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isDriverTyping, setIsDriverTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'm1',
          sender: 'driver',
          text: language === 'hi' 
            ? `नमस्ते! मैं आपकी राइड के लिए निकल चुका हूँ। आपकी लोकेशन की ओर आ रहा हूँ।` 
            : `Hello! I have started towards your pickup location.`,
          timestamp: 'अभी (Now)'
        }
      ]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDriverTyping]);

  if (!isOpen) return null;

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Trigger driver auto reply
    setIsDriverTyping(true);
    setTimeout(() => {
      setIsDriverTyping(false);
      const randomReply = DRIVER_CHAT_RESPONSES[Math.floor(Math.random() * DRIVER_CHAT_RESPONSES.length)];
      const replyText = language === 'hi' ? randomReply.hi : randomReply.en;

      setMessages(prev => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          sender: 'driver',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden h-[85vh] sm:h-[600px] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-slate-900" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {language === 'hi' ? driver.nameHi : driver.name}
              </h4>
              <p className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                <span>{driver.vehiclePlate}</span>
                <span className="text-[10px] text-slate-400">• {driver.vehicleModel}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Masked Safety Notice */}
        <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-100 flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'hi' ? 'आपकी सुरक्षा के लिए चैट सुरक्षित और एन्क्रिप्टेड है' : 'Chats are end-to-end secure'}</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                {msg.timestamp}
                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-600" />}
              </span>
            </div>
          ))}

          {isDriverTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-white px-3 py-2 rounded-2xl w-fit border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span>{language === 'hi' ? 'ड्राइवर टाइप कर रहा है...' : 'Driver is typing...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick auto-reply chips */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {QUICK_CHAT_MESSAGES.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(language === 'hi' ? chip.hi : chip.en)}
              className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 text-slate-700 text-[11px] font-semibold whitespace-nowrap hover:bg-emerald-50 hover:border-emerald-300 transition shrink-0 active:scale-95"
            >
              {language === 'hi' ? chip.hi : chip.en}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage(inputText);
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={language === 'hi' ? 'ड्राइवर को संदेश लिखें...' : 'Type a message to driver...'}
            className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition active:scale-95 shrink-0 shadow-md shadow-emerald-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
