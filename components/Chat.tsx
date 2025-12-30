
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithGemini } from '../services/geminiService';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !pendingImage) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: []
    };

    if (input.trim()) {
      userMessage.parts.push({ text: input });
    }

    if (pendingImage) {
      userMessage.parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: pendingImage
        }
      });
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setPendingImage(null);
    setIsLoading(true);

    try {
      const response = await chatWithGemini(newMessages);
      setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Sorry, I had trouble processing that." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPendingImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full h-[80vh] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-emerald-600 p-4 text-white flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h2 className="font-bold">AgroVision AI Assistant</h2>
          <p className="text-xs text-emerald-100">Ask about crops, pests, or upload a photo</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">How can I help you today?</h3>
            <p className="text-gray-500 max-w-sm">
              Ask me about plant care, identify a pest from a photo, or get advice on sustainable farming.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              {m.parts.map((p, j) => (
                <div key={j}>
                  {p.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.text}</p>}
                  {p.inlineData && (
                    <img 
                      src={`data:${p.inlineData.mimeType};base64,${p.inlineData.data}`} 
                      className="mt-2 rounded-lg max-w-full max-h-60" 
                      alt="Uploaded" 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl p-4 rounded-tl-none flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        {pendingImage && (
          <div className="mb-4 relative inline-block">
            <img src={`data:image/jpeg;base64,${pendingImage}`} className="h-20 rounded-lg shadow-sm" alt="Preview" />
            <button 
              onClick={() => setPendingImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <label className="p-2 text-gray-400 hover:text-emerald-600 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
