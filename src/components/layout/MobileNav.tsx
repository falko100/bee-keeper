import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Warehouse, BarChart3, CalendarCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/hives', icon: Warehouse, label: 'Hives' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/planning', icon: CalendarCheck, label: 'Plan' },
];

export default function MobileNav() {
  const { signOut } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium ${isActive ? 'text-amber-600' : 'text-gray-500'}`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
        <button onClick={signOut} className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium text-gray-500">
          <LogOut size={20} />
          Out
        </button>
      </div>
    </nav>
  );
}
