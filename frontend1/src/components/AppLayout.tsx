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
          <button className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg font-semibold transform hover:scale-105 hover:shadow-xl text-sm">
            <span className="relative z-10">Sign in</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button className="group relative px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-full hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 shadow-lg font-semibold transform hover:scale-105 hover:shadow-xl border-2 border-white/20 text-sm">
            <span className="relative z-10">Register</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </header>
      <main className="pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
