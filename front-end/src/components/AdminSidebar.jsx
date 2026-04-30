import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, CreditCard, LogOut, Shield } from 'lucide-react';

const AdminSidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
      isActive
        ? 'bg-[#592b98] text-white font-semibold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#592b98] rounded-md flex items-center justify-center text-white font-bold text-sm">L</div>
          <span className="text-base font-bold text-gray-900 tracking-tight">LearnTrack</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Administration</p>

        <NavLink to="/admin/dashboard" className={navLinkClass}>
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span>Overview</span>
        </NavLink>

        <NavLink to="/admin/courses" className={navLinkClass}>
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span>Course Review</span>
        </NavLink>

        <NavLink to="/admin/users" className={navLinkClass}>
          <Users className="w-4 h-4 flex-shrink-0" />
          <span>User Management</span>
        </NavLink>

        <NavLink to="/admin/payments" className={navLinkClass}>
          <CreditCard className="w-4 h-4 flex-shrink-0" />
          <span>Payments</span>
        </NavLink>
      </nav>

      <div className="px-3 py-3 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#592b98] to-[#9b6cd9] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Administrator
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
