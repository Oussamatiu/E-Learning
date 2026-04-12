import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/authApi';


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: 3 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiService.register(formData);
      // If the API returns user/token immediately, log them in
      if (data.user && data.token) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
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
               Start your <br /> 
               <span className="text-[#FF6636]">learning journey.</span>
             </h2>
             <p className="text-white/60 text-lg max-w-sm leading-relaxed">
               Create an account and get access to 100+ professional courses with built-in time tracking.
             </p>
          </div>

          <div className="relative z-10 flex gap-6">
             <div className="flex -space-x-3">
                {[5,6,7,8].map(i => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-[#1A1F5E] object-cover" src={`https://i.pravatar.cc/100?u=${i+20}`} alt="User" />
                ))}
             </div>
             <div className="text-white/80 text-sm font-medium">
                <span className="block font-bold text-white">Joined by</span>
                5000+ Students
             </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 md:hidden">
              <div className="w-8 h-8 bg-[#FF6636] rounded-lg flex items-center justify-center text-white italic text-lg font-bold">L</div>
              <span className="text-xl font-semibold text-[#1A1F5E]">LearnTrack</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1A1F5E] mb-2">Create Account</h1>
            <p className="text-slate-400 font-normal">Join our community of professional learners.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
               <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <p className="text-sm text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#1A1F5E]/40">Full Name</label>
                <input 
                  required 
                  type="text" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#FF6636]/10 focus:border-[#FF6636] outline-none transition-all text-sm font-semibold" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#1A1F5E]/40">Account Type</label>
                <div className="relative">
                  <select 
                    onChange={(e) => setFormData({...formData, role_id: parseInt(e.target.value)})} 
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#FF6636]/10 focus:border-[#FF6636] outline-none transition-all text-sm font-semibold appearance-none"
                  >
                    <option value="3">Student</option>
                    <option value="2">Instructor</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1A1F5E]/40">Email Address</label>
              <input 
                required 
                type="email" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#FF6636]/10 focus:border-[#FF6636] outline-none transition-all text-sm font-semibold" 
                placeholder="john@example.com" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1A1F5E]/40">Password</label>
              <input 
                required 
                type="password" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#FF6636]/10 focus:border-[#FF6636] outline-none transition-all text-sm font-semibold" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-[#FF6636] text-white font-bold py-5 rounded-2xl hover:bg-[#e85a2c] transition-all shadow-xl shadow-[#FF6636]/20 active:scale-[0.98] mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating Account...
                </span>
              ) : 'Create My Account →'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-normal">
              Already have an account? <button onClick={() => navigate('/login')} className="text-[#1A1F5E] font-bold hover:underline underline-offset-4">Sign In</button>
            </p>
          </div>
          
          <p className="mt-8 text-center text-[11px] text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
            By joining, you agree to our 1-device policy and built-in anti-recording content protections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;