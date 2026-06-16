import { Bell, User, Calendar, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState, useEffect } from 'react';

export function Header() {
  const { getDashboardStats, sidebarCollapsed } = useAppStore();
  const stats = getDashboardStats();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200 z-40 transition-all duration-300
        ${sidebarCollapsed ? 'left-20' : 'left-64'}`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-cream-700">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </div>
          <div className="h-4 w-px bg-cream-300" />
          <div className="flex items-center gap-2 text-primary-600 font-mono">
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-cream-800">本月产量:</span>
              <span className="font-bold text-primary-600">{stats.monthlyProduction.toLocaleString()}</span>
              <span className="text-xs text-cream-600">瓶</span>
            </div>
          </div>

          <button className="relative p-2 text-cream-600 hover:text-primary-600 hover:bg-cream-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {stats.pendingOrders > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-fermentation-alert text-white text-xs rounded-full flex items-center justify-center">
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-cream-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-cream-900">陈师傅</p>
              <p className="text-xs text-cream-500">首席发酵师</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
