import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsApiKeySet(true);
      setMessages([{
        role: 'assistant',
        content: 'Xin chào! Tôi đã sẵn sàng trò chuyện với bạn. Hãy hỏi tôi bất cứ điều gì!'
      }]);
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Xin chào! Vui lòng cấu hình API key để bắt đầu trò chuyện.'
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveApiKey = () => {
    if (!tempApiKey.trim()) {
      alert('Vui lòng nhập API key!');
      return;
    }
    localStorage.setItem('openrouter_api_key', tempApiKey);
    setApiKey(tempApiKey);
    setIsApiKeySet(true);
    setTempApiKey('');
    setMessages([{
      role: 'assistant',
      content: 'API key đã được lưu! Bạn có thể bắt đầu trò chuyện ngay bây giờ.'
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'AI Chatbot'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Có lỗi xảy ra');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Lỗi: ${error instanceof Error ? error.message : 'Không xác định'}. Vui lòng kiểm tra API key hoặc thử lại.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">🤖 AI Chatbot - OpenRouter</h1>
        </div>

        {/* API Key Setup */}
        {!isApiKeySet && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Nhập OpenRouter API Key của bạn"
              className="w-full px-4 py-3 border-2 border-purple-600 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={saveApiKey}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Lưu API Key
            </button>
            <div className="mt-3 text-sm text-gray-600">
              📌 Lấy API key miễn phí tại:{' '}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
                openrouter.ai/keys
              </a>
              <br />
              🔒 API key được lưu trong trình duyệt của bạn
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[70%] px-6 py-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={!isApiKeySet || isLoading}
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!isApiKeySet || isLoading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
