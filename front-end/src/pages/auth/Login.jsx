import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/authApi';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiService.login(email, password);
      // Save user and token to localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      navigate('/'); // Redirect to home on success
    } catch (err) {
      setError(err.message); // Show "Password incorrect" or "User not found"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased text-[#1A1F5E]">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF6636]/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row relative z-10 border border-white">
        
        {/* Left Side - Image/Info */}
        <div className="hidden md:flex md:w-1/2 bg-[#1A1F5E] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-10 right-10 w-32 h-32 bg-[#FF6636] rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold text-sm group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
            </button>
          </div>

          <div className="relative z-10">
             <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
               Master your skills <br /> 
               <span className="text-[#FF6636]">every minute.</span>
             </h2>
             <p className="text-white/60 text-lg max-w-sm leading-relaxed">
               Join 200K+ learners and start your professional journey with precision time tracking.
             </p>
          </div>

          <div className="relative z-10 flex gap-6">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-[#1A1F5E] object-cover" src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" />
                ))}
             </div>
             <div className="text-white/80 text-sm font-medium">
                <span className="block font-bold text-white">200K+</span>
                Active Learners
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-8 h-8 bg-[#FF6636] rounded-lg flex items-center justify-center text-white italic text-lg font-bold">L</div>
              <span className="text-xl font-semibold text-[#1A1F5E]">LearnTrack</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1A1F5E] mb-3">Welcome Back</h1>
            <p className="text-slate-400 font-normal">Sign in to continue your learning path.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
               <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <p className="text-sm text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1A1F5E]/40">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF6636] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                </div>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#FF6636]/10 focus:border-[#FF6636] outline-none transition-all text-sm font-semibold"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                 <label className="text-xs font-semibold uppercase tracking-widest text-[#1A1F5E]/40">Password</label>
                 <button type="button" className="text-xs font-semibold text-[#FF6636] uppercase tracking-widest hover:underline underline-offset-4">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF6636] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#FF6636]/10 focus:border-[#FF6636] outline-none transition-all text-sm font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#FF6636] text-white font-bold py-5 rounded-2xl hover:bg-[#e85a2c] transition-all disabled:opacity-50 mt-4 shadow-xl shadow-[#FF6636]/20 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Authenticating...
                </span>
              ) : 'Sign In Now →'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-400 font-normal">
              New to LearnTrack? <button onClick={() => navigate('/register')} className="text-[#1A1F5E] font-bold hover:underline underline-offset-4">Create Account</button>
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-50 flex justify-center gap-8 opacity-40 grayscale">
             <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure
             </div>
             <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Verified
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;