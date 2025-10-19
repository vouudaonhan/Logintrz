import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import '../index2.css';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const Notifications = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content || "Không có phản hồi hoặc lỗi 😢";

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

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Đăng nhập thành công',
      message: 'Chào mừng bạn quay trở lại! Phiên đăng nhập của bạn đã được bảo mật.',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Cập nhật bảo mật',
      message: 'Hệ thống đã được cập nhật với các tính năng bảo mật mới.',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Kiểm tra tài khoản',
      message: 'Vui lòng xác minh thông tin tài khoản của bạn để đảm bảo bảo mật.',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
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
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative min-h-screen p-6">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="video-bg"
      >
        <source src="https://dl.dropboxusercontent.com/s/5z2aa8x6x8nijiz44g6s4/46c99f8934d4aaf0105e2be19c909fbd.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video background.
      </video>

      <div className="video-overlay"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {showCountdown && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl mb-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Clock className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Chào mừng đến với hệ thống!</h2>
            </div>
            <p className="text-lg mb-4">Tự động chuyển đến menu trong:</p>
            <div className="text-4xl font-bold bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              {countdown}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-white" />
                <h1 className="text-2xl font-bold text-white">Thông báo</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Không có thông báo nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      notification.read
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.timestamp.toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🤖 Chatbot GLM-4.6</h1>
          </div>

          <div className="p-6">
            <div className="h-96 overflow-y-auto border border-gray-300 p-4 mb-4 rounded-md bg-gray-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`my-2 ${
                    msg.role === "user" ? "text-blue-600 text-right" : "text-gray-800"
                  }`}
                >
                  <b>{msg.role === "user" ? "Bạn: " : "Bot: "}</b>
                  {msg.content}
                </div>
              ))}
              {loading && <p className="text-center text-gray-500">Đang phản hồi...</p>}
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
      </div>
    </div>
  );
};
