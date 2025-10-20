import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// ----------------------------
// Interface định nghĩa
// ----------------------------
interface Message {
  role: "user" | "bot";
  content: string;
}

// ----------------------------
// Component chính
// ----------------------------
const Notifications: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); // ✅ đã khai báo kiểu
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động scroll xuống khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ----------------------------
  // Gửi tin nhắn
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // ⚙️ Gọi API (bạn có thể thay localhost bằng API Render của bạn)
      const res = await axios.post("/api/chat", { message: input });
      const botMessage: Message = {
        role: "bot",
        content: res.data.response || "Không có phản hồi từ máy chủ.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "bot",
        content: "❌ Lỗi kết nối! Hãy thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  // ----------------------------
  // Giao diện
  // ----------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center shadow-lg">
        <h1 className="text-2xl font-bold">💬 Chat với Gemma-2-9B</h1>
        <p className="text-blue-100 mt-1">AI hội thoại miễn phí!</p>
      </header>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>Xin chào! Hãy nhập tin nhắn để bắt đầu trò chuyện 💡</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow-md rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-lg shadow-md rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-gray-500 text-sm">Đang phản hồi...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="bg-white p-4 border-t shadow-md">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span>Gửi</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// ----------------------------
// Export
// ----------------------------
export { Notifications };
export default Notifications;
