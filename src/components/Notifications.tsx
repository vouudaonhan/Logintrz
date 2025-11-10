// File: src/components/Notifications.tsx

import React, { useState } from 'react';
import MainLayout from './MainLayout';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsProps {
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'Thông báo mới',
      message: 'Bạn có một tin nhắn mới từ hệ thống',
      time: '5 phút trước',
      read: false
    },
    {
      id: 2,
      title: 'Cập nhật',
      message: 'Phiên bản mới đã được phát hành',
      time: '1 giờ trước',
      read: false
    },
    {
      id: 3,
      title: 'Nhắc nhở',
      message: 'Đừng quên hoàn thành nhiệm vụ hôm nay',
      time: '2 giờ trước',
      read: true
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MainLayout onClose={onClose}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Thông báo</h1>
              <p className="text-gray-600 mt-1">
                Bạn có {unreadCount} thông báo chưa đọc
              </p>
            </div>
            
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không có thông báo
              </h3>
              <p className="text-gray-500">
                Bạn đã xem hết tất cả thông báo
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${
                  !notification.read ? 'border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Mới
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {notification.message}
                    </p>
                    
                    <p className="text-sm text-gray-400">
                      🕐 {notification.time}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        ✓
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa thông báo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
