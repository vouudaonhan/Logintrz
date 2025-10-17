import React, { useState, useEffect } from "react";
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";

// ============================
// Interface định nghĩa
// ============================
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// ============================
// Thành phần nền video động
// ============================
const VideoBackground: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source
          src="https://dl.dropboxusercontent.com/s/5z2aa8x6x8nijiz44g6s4/46c99f8934d4aaf0105e2be19c909fbd.mp4"
          type="video/mp4"
        />
      </video>

      {/* Lớp phủ đen nhẹ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          color: "white",
          textAlign: "center",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ============================
// Thành phần thông báo
// ============================
const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Đăng nhập thành công",
      message: "Chào mừng bạn quay trở lại! Phiên đăng nhập của bạn an toàn.",
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Cập nhật hệ thống",
      message:
        "Hệ thống GLM-4.6 đã được nâng cấp để hỗ trợ hội thoại dài và mượt hơn.",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);

  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    if (countdown > 0 && showCountdown) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowCountdown(false);
    }
  }, [countdown, showCountdown]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-xl mx-auto mt-6">
      {showCountdown && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl mb-6 text-center shadow-lg">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Clock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Chào mừng đến với Chatbot GLM!</h2>
          </div>
          <p className="text-lg mb-4">Giao diện sẵn sàng sau:</p>
          <div className="text-4xl font-bold bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            {countdown}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white">Thông báo</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500">Không có thông báo.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-lg border ${
                  n.read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex space-x-3">
                    {getIcon(n.type)}
                    <div>
                      <h3
                        className={`font-semibold ${
                          n.read ? "text-gray-700" : "text-gray-900"
                        }`}
                      >
                        {n.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          n.read ? "text-gray-500" : "text-gray-700"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {n.timestamp.toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================
// Chatbot chính
// ============================
const ChatbotGLM: React.FC = () => {
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Không thể kết nối đến máy chủ." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">
        🤖 Chatbot GLM-4.6
      </h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4">
        <div className="h-96 overflow-y-auto border border-gray-300 p-2 mb-3 rounded-md">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-2 ${
                msg.role === "user"
                  ? "text-blue-600 text-right"
                  : "text-gray-800"
              }`}
            >
              <b>{msg.role === "user" ? "Bạn: " : "Bot: "}</b>
              {msg.content}
            </div>
          ))}
          {loading && (
            <p className="text-center text-gray-500">Đang phản hồi...</p>
          )}
        </div>

        <div className="flex">
          <input
            className="flex-1 border border-gray-400 rounded-md px-3 py-2 mr-2"
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

// ============================
// App tổng hợp
// ============================
const App: React.FC = () => {
  return (
    <VideoBackground>
      <div className="container mx-auto p-4">
        <Notifications />
        <ChatbotGLM />
      </div>
    </VideoBackground>
  );
};

export default App;
