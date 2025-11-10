import React, { useState } from 'react';
// Sửa lỗi 1: Thay đổi cách import
import Notifications from './Notifications';

// Định nghĩa types
type PageType = 'home' | 'profile' | 'settings' | 'notifications';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [showNotifications, setShowNotifications] = useState(false);

  // Sửa lỗi 3: Thay đổi type của parameter
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    if (page === 'notifications') {
      setShowNotifications(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">My App</h1>
            
            {/* Navigation */}
            <nav className="flex gap-4">
              <button
                onClick={() => handleNavigate('home')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'home'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Trang chủ
              </button>
              
              <button
                onClick={() => handleNavigate('profile')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'profile'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Hồ sơ
              </button>
              
              <button
                onClick={() => handleNavigate('settings')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'settings'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cài đặt
              </button>
              
              <button
                onClick={() => handleNavigate('notifications')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'notifications'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Thông báo
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
        
        {/* Render content based on current page */}
        {currentPage === 'home' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Trang chủ</h2>
            <p>Chào mừng đến với ứng dụng của chúng tôi!</p>
          </div>
        )}
        
        {currentPage === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Hồ sơ</h2>
            <p>Thông tin hồ sơ của bạn</p>
          </div>
        )}
        
        {currentPage === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Cài đặt</h2>
            <p>Quản lý cài đặt của bạn</p>
          </div>
        )}
        
        {currentPage === 'notifications' && showNotifications && (
          <Notifications onClose={() => setShowNotifications(false)} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; 2025 My App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
