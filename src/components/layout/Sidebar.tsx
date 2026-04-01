import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Warehouse, BarChart3, CalendarCheck, Lightbulb } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hives', icon: Warehouse, label: 'Hives' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/planning', icon: CalendarCheck, label: 'Planning' },
  { to: '/tips', icon: Lightbulb, label: 'Tips' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <span className="text-2xl">🐝</span>
        <h1 className="text-xl font-bold text-amber-700">BeeKeeper</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : 'text-gray-600'}`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
