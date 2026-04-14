import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Bar */}
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

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-[#592b98] rounded flex items-center justify-center text-white font-bold text-lg">L</div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">LearnTrack</span>
          </Link>

          {/* Search Bar - Udemy Style */}
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

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/courses" className="text-gray-700 hover:text-[#592b98] font-medium text-sm">Browse Courses</Link>
            <Link to="/categories" className="text-gray-700 hover:text-[#592b98] font-medium text-sm">Categories</Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search for mobile */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#592b98] text-white text-xs font-bold rounded-full flex items-center justify-center">0</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img src={user.avatar || "https://i.pravatar.cc/150?u=user"} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role || 'Student'}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Profile</button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My courses</button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Account settings</button>
                      {(user.role_id === 3 || user.role === 'instructor' || user.role?.title === 'instructor') && (
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate('/instructor/dashboard');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#592b98] hover:bg-gray-50"
                        >
                          Instructor dashboard
                        </button>
                      )}
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Log out
                      </button>
                    </div>
                  </>
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