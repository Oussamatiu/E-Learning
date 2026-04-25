import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartCount } from '../hooks/useCart';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef = useRef(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = useCartCount();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch (e) { setUser(null); }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
  };

  const isInstructor = user?.role_id === 2 || user?.role?.title === 'instructor';
  const dashboardPath = isInstructor ? '/instructor/dashboard' : '/student/dashboard';
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Bar */}
      {!user && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <Link to="/courses" className="text-gray-600 hover:text-[#592b98] font-medium">Explore Careers</Link>
              <Link to="/mentors" className="text-gray-600 hover:text-[#592b98] font-medium hidden sm:block">Mentorship</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/become-instructor" className="text-gray-600 hover:text-[#592b98] font-medium">Teach on LearnTrack</Link>
            </div>
          </div>
        </div>
      )}


      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 py-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-[#592b98] rounded flex items-center justify-center text-white font-bold text-lg">L</div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">LearnTrack</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything"
                className="w-full bg-gray-100 border border-gray-300 rounded-md py-2.5 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="absolute right-0 top-0 bottom-0 bg-[#592b98] text-white px-6 rounded-r-md text-sm font-medium hover:bg-[#3e1f6b] transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/courses" className="text-gray-700 hover:text-[#592b98] font-medium text-sm">Browse Courses</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">

            {/* Dashboard button */}
            {user && (
              <button
                onClick={() => navigate(dashboardPath)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 border border-[#592b98] text-[#592b98] text-sm font-semibold rounded-md hover:bg-[#592b98] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </button>
            )}

            {/* Mobile search */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#592b98] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ── Avatar + Dropdown ── */}
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  id="avatar-menu-btn"
                  onClick={() => setShowDropdown(d => !d)}
                  className="flex items-center gap-1.5 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#592b98] to-[#9b6cd9] flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                    {initials}
                  </div>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">

                    {/* User card */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#592b98] to-[#9b6cd9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${isInstructor ? 'bg-purple-100 text-[#592b98]' : 'bg-blue-50 text-blue-600'
                        }`}>
                        {isInstructor ? 'Instructor' : 'Student'}
                      </span>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => { navigate(dashboardPath); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#592b98] transition-colors text-left"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </button>

                      {/* Profile — instructors only */}
                      {isInstructor && (
                        <button
                          onClick={() => { navigate('/instructor/setup-profile'); setShowDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#592b98] transition-colors text-left"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </button>
                      )}

                      <button
                        onClick={() => { navigate('/courses'); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#592b98] transition-colors text-left"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Browse Courses
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-[#592b98] font-medium text-sm px-4 py-2">
                  Log in
                </button>
                <button onClick={() => navigate('/register')} className="bg-[#592b98] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#3e1f6b] transition-colors">
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;