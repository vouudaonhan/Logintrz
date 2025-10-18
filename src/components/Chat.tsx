import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content || "Không có phản hồi từ máy chủ.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Không thể kết nối đến máy chủ." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-purple-800 text-white">
      <h1 className="text-3xl font-bold mb-4 drop-shadow-lg">🤖 Chatbot GLM-4.6</h1>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20">
        <div className="h-96 overflow-y-auto border border-white/20 p-3 mb-3 rounded-md bg-black/30">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-2 ${
                msg.role === "user" ? "text-blue-300 text-right" : "text-gray-100"
              }`}
            >
              <b>{msg.role === "user" ? "Bạn: " : "Bot: "}</b>
              {msg.content}
            </div>
          ))}
          {loading && <p className="text-center text-gray-400">Đang phản hồi...</p>}
        </div>

        <div className="flex">
          <input
            className="flex-1 border border-white/30 bg-transparent text-white placeholder-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none"
            value={input}
            placeholder="Nhập tin nhắn..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={sendMessage}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
