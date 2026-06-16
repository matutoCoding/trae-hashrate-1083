import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '../../store/useAppStore';

export function Layout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-cream-100">
      <Sidebar />
      <Header />
      
      <main 
        className={`pt-16 transition-all duration-300 min-h-screen
          ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        <div className="p-6 max-w-screen-2xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
