import { useState } from 'react';
import { 
  Home, 
  Bell, 
  User, 
  Settings, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Calendar,
  Shield,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  unreadNotifications?: number;
}

export const Navigation = ({ currentPage, onPageChange, unreadNotifications = 0 }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'notifications', label: 'Thông báo', icon: Bell, badge: unreadNotifications },
    { id: 'documents', label: 'Tài liệu', icon: FileText },
    { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
    { id: 'calendar', label: 'Lịch', icon: Calendar },
    { id: 'account', label: 'Tài khoản', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
    { id: 'help', label: 'Trợ giúp', icon: HelpCircle },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </div>
              <div className="flex space-x-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === item.id
                          ? 'bg-blue-100 text-blue-700 shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-2 py-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`relative w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};