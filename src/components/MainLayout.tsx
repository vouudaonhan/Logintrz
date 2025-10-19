import { useState } from "react";
import { Navigation } from "./Navigation";
import { Dashboard } from "./Dashboard";
import { Notifications } from "./Notifications";  // Đảm bảo export default ở Notifications.tsx
import { AccountManagement } from "./AccountManagement";
import { 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Calendar, 
  Settings, 
  HelpCircle,
  Construction
} from 'lucide-react';

// Type cho PlaceholderPage props (đã có, nhưng explicit hơn)
interface PlaceholderPageProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;  // Type cho Lucide icons
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon: Icon, description }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
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

// Type cho currentPage (union các giá trị có thể)
type PageType = 'dashboard' | 'notifications' | 'account' | 'documents' | 'analytics' | 'messages' | 'calendar' | 'security' | 'settings' | 'help';

// Type cho Navigation props (dựa trên usage; adjust nếu Navigation có type riêng)
interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  unreadNotifications: number;
}

export const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('notifications');

  const renderPage = (): React.ReactNode => {  // Explicit return type
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'notifications':
        return <Notifications />;
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
        return <Notifications />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        unreadNotifications={2}
      />
      {renderPage()}
    </div>
  );
};
