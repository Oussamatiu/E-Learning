import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'IN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-[#592b98] rounded-full flex items-center justify-center text-white font-bold">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Instructor Hub</p>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.name || 'Instructor'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavLink
          to="/instructor/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? 'bg-[#f8f5ff] text-[#592b98] font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/instructor/courses"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? 'bg-[#f8f5ff] text-[#592b98] font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <BookOpen className="w-5 h-5" />
          <span>My Courses</span>
        </NavLink>

        <NavLink
          to="/instructor/create-course"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? 'bg-[#f8f5ff] text-[#592b98] font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Course</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
