import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, PlusCircle, LogOut, Compass, GraduationCap, Wallet
} from 'lucide-react';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  const isInstructor = user.role_id === 3 || user.role === 'instructor' || user.role?.title === 'instructor';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
      isActive
        ? 'bg-[#592b98] text-white font-semibold shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#592b98] rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
          <span className="text-base font-bold text-gray-900 tracking-tight">LearnTrack</span>
        </Link>
      </div>

      {/* User card */}
  

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        
        {isInstructor && (
          <>
            {/* Teaching section */}
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Teaching</p>

            <NavLink to="/instructor/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span>Instructor Hub</span>
            </NavLink>

            <NavLink to="/instructor/courses" className={navLinkClass}>
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span>Manage Courses</span>
            </NavLink>

            <NavLink to="/instructor/create-course" className={navLinkClass}>
              <PlusCircle className="w-4 h-4 flex-shrink-0" />
              <span>Create Course</span>
            </NavLink>

            <NavLink to="/instructor/wallet" className={navLinkClass}>
              <Wallet className="w-4 h-4 flex-shrink-0" />
              <span>Wallet</span>
            </NavLink>

            <div className="pt-4 pb-2">
              <div className="h-px bg-gray-100 mb-3" />
            </div>
          </>
        )}

        {/* Student section */}
        <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">My Learning</p>

        <NavLink to="/student/dashboard" className={navLinkClass}>
          <GraduationCap className="w-4 h-4 flex-shrink-0" />
          <span>Student Dashboard</span>
        </NavLink>

        <NavLink to="/student/courses" className={navLinkClass}>
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span>Enrolled Courses</span>
        </NavLink>

        <NavLink to="/courses" className={navLinkClass}>
          <Compass className="w-4 h-4 flex-shrink-0" />
          <span>Browse Courses</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100">
            
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#592b98] to-[#9b6cd9] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
            <p className="text-xs text-gray-400">{isInstructor ? 'Instructor' : 'Student'}</p>
          </div>
        
      </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
