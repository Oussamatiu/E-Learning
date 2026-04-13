import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check localStorage for user data whenever the component mounts or the location changes
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
  }, [location.pathname]); // Re-check when navigating

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <nav className="h-20 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="w-[80%] lg:w-[85%] mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
            <div className="w-10 h-10 bg-[#FF6636] rounded-xl flex items-center justify-center text-white italic text-xl font-bold shadow-lg shadow-[#FF6636]/20 group-hover:rotate-12 transition-transform duration-500">L</div>
            <span className="text-[#1A1F5E] tracking-tighter">LearnTrack</span>
          </Link>
          <div className="hidden lg:flex gap-8 text-[15px] font-semibold text-slate-500">
            <Link to="/courses" className="hover:text-[#FF6636] transition-colors relative group py-2">
              Browse Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6636] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/categories" className="hover:text-[#FF6636] transition-colors relative group py-2">
              Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6636] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/mentors" className="hover:text-[#FF6636] transition-colors relative group py-2">
              Mentors
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6636] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/become-instructor" className="hover:text-[#FF6636] transition-colors relative group py-2">
              Become an Instructor
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6636] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Shopping Cart Button */}
          <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-300 group">
            <svg className="w-6 h-6 text-[#1A1F5E] group-hover:text-[#FF6636] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6636] text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-2xl transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#FF6636]/20">
                  <img src={user.avatar || "https://i.pravatar.cc/150?u=user"} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden md:block">
                  <span className="block text-sm font-bold text-[#1A1F5E] leading-none mb-1">{user.name}</span>
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{user.role || 'Student'}</span>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 py-3 z-20 animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Account</p>
                      <p className="text-sm font-bold text-[#1A1F5E] truncate">{user.name}</p>
                    </div>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-[#FF6636] hover:bg-orange-50 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profile Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-[#FF6636] hover:bg-orange-50 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      My Courses
                    </button>
                    <div className="h-px bg-slate-50 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/login')} className="text-[15px] font-bold text-[#1A1F5E] hover:text-[#FF6636] transition-colors">Log in</button>
              <button onClick={() => navigate('/register')} className="bg-[#FF6636] text-white text-[15px] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#e85a2c] transition-all shadow-xl shadow-[#FF6636]/20 active:scale-95">Sign Up Now</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;