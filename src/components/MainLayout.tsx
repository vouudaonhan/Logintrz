// File: src/components/MainLayout.tsx

import React, { useState } from "react";
import { Navigation } from "./Navigation";
import { Dashboard } from "./Dashboard";
import { Notifications } from "./Notifications";
import { AccountManagement } from "./AccountManagement";
import { Chatbot } from "./Chatbot";
import { 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Calendar, 
  Settings, 
  HelpCircle,
  Construction
} from 'lucide-react';

// ===== Type định nghĩa =====
interface PlaceholderPageProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

type PageType = 
  | 'dashboard'
  | 'notifications'
  | 'account'
  | 'documents'
  | 'analytics'
  | 'messages'
  | 'calendar'
  | 'security'
  | 'settings'
  | 'help';

interface MainLayoutProps {
  children?: React.ReactNode;
  onClose?: () => void;
}

// ===== Component PlaceholderPage =====
const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon: Icon, description }) => (
  <div className="min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="flex items-center justify-center space-x-2 text-yellow-600">
        <Construction className="w-5 h-5" />
        <span className="text-sm font-medium">Đang phát triển</span>
      </div>
    </div>
  </div>
);

// ===== Component MainLayout =====
export const MainLayout: React.FC<MainLayoutProps> = ({ children, onClose }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderPage = (): React.ReactNode => {
    if (children) return children;

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'notifications':
        return <Notifications onClose={onClose} />;
      case 'account':
        return <AccountManagement />;
      case 'documents':
        return (
          <PlaceholderPage
            title="Tài liệu"
            icon={FileText}
            description="Quản lý và truy cập các tài liệu của bạn"
          />
        );
      case 'analytics':
        return (
          <PlaceholderPage
            title="Thống kê"
            icon={BarChart3}
            description="Xem báo cáo và phân tích dữ liệu"
          />
        );
      case 'messages':
        return (
          <PlaceholderPage
            title="Tin nhắn"
            icon={MessageSquare}
            description="Gửi và nhận tin nhắn từ người dùng khác"
          />
        );
      case 'calendar':
        return (
          <PlaceholderPage
            title="Lịch"
            icon={Calendar}
            description="Quản lý lịch trình và sự kiện"
          />
        );
      case 'security':
        return <AccountManagement />;
      case 'settings':
        return (
          <PlaceholderPage
            title="Cài đặt"
            icon={Settings}
            description="Tùy chỉnh các cài đặt hệ thống"
          />
        );
      case 'help':
        return (
          <PlaceholderPage
            title="Trợ giúp"
            icon={HelpCircle}
            description="Tìm câu trả lời cho các câu hỏi thường gặp"
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">My App</h1>

          {/* Navigation */}
          <Navigation
            currentPage={currentPage}
            onPageChange={(page: PageType) => setCurrentPage(page)}
            unreadNotifications={2}
          />

          {/* Nút đóng (nếu có onClose) */}
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              Đóng
            </button>
          )}
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; 2025 My App. All rights reserved.</p>
        </div>
      </footer>

      {/* Chatbot - Floating button ở góc phải dưới */}
      <Chatbot />
    </div>
  );
};

export default MainLayout;
