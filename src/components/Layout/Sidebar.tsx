import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Flame, 
  Box, 
  Thermometer, 
  FlaskConical, 
  Clock, 
  Package, 
  Receipt,
  ChevronLeft,
  ChevronRight,
  Droplets
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '首页概览' },
  { path: '/grinding', icon: Flame, label: '磨浆点卤' },
  { path: '/pressing', icon: Box, label: '压坯划块' },
  { path: '/cultivation', icon: Thermometer, label: '前期培菌' },
  { path: '/bottling', icon: FlaskConical, label: '搓毛装坛' },
  { path: '/fermentation', icon: Clock, label: '后期发酵' },
  { path: '/packaging', icon: Package, label: '装瓶贴标' },
  { path: '/sales', icon: Receipt, label: '销售台账' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-cream-900 to-cream-800 text-cream-100 transition-all duration-300 z-50 flex flex-col
        ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className={`p-6 flex items-center gap-3 border-b border-cream-700/50 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
          <Droplets className="w-6 h-6 text-amber-300" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-serif text-lg font-bold text-amber-400 whitespace-nowrap">腐乳作坊</h1>
            <p className="text-xs text-cream-400 whitespace-nowrap">发酵工艺管理系统</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <li key={item.path} style={{ animationDelay: `${index * 50}ms` }}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  nav-item ${sidebarCollapsed ? 'justify-center' : ''}
                  ${isActive ? 'active' : ''}
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? '' : 'transition-transform duration-200 group-hover:scale-110'}`} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={toggleSidebar}
        className="p-4 border-t border-cream-700/50 hover:bg-cream-700/30 transition-colors flex items-center justify-center"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}
