import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const location = useLocation();
  const { hasNewMessage } = useAuth();

  const menuItems = [
    { path: '/explore', label: '탐색', icon: '🔍' },
    { path: '/chat', label: '채팅', icon: '💬', notification: hasNewMessage },
    { path: '/mypage', label: '마이페이지', icon: '👤' }
  ];

  return (
    <div className={`fixed top-0 right-0 h-screen bg-black shadow-2xl z-50 w-[280px] flex flex-col ${className}`}>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`relative flex-1 flex items-center justify-center text-white text-3xl font-bold border-b-2 border-gray-600 transition-all duration-200 ${
            location.pathname === item.path 
              ? 'bg-gray-800' 
              : 'bg-black hover:bg-gray-700'
          }`}
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
          {item.notification && (
            <span className="absolute top-1/2 -translate-y-1/2 right-4 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              1
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
