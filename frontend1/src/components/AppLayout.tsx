import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-40 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-gray-800">failly</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Sign in</button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</button>
        </div>
      </header>
      <main className="pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
