const Footer = () => (
  <footer className="bg-[#1A1F5E] pt-24 pb-12 text-white border-t border-white/10">
    <div className="w-[80%] lg:w-[80%] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
        <div className="lg:col-span-2">
           <div className="text-3xl font-semibold flex items-center gap-2 mb-8 group cursor-pointer">
             <div className="w-10 h-10 bg-[#FF6636] rounded-xl flex items-center justify-center text-white italic text-xl font-bold group-hover:scale-110 transition-transform">L</div>
             <span className="text-white tracking-tight">LearnTrack</span>
           </div>
           <p className="text-white/50 mb-10 max-w-sm text-[15px] leading-relaxed font-normal">
             Learn anywhere, and anytime. The platform for all students who are interested in our professional learning journey.
           </p>
           <div className="flex gap-4">
             {['fb', 'tw', 'ig', 'li'].map(social => (
               <a key={social} href="#" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#FF6636] transition-all duration-300 border border-white/10 hover:border-transparent group">
                 <div className="w-5 h-5 bg-white/20 group-hover:bg-white rounded-sm transition-colors" />
               </a>
             ))}
           </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-8 text-white uppercase tracking-widest text-xs">Platform</h4>
          <ul className="space-y-4 text-white/50 text-[15px] font-normal">
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Browse Courses</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Categories</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Become Instructor</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Pricing</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Mentors</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-8 text-white uppercase tracking-widest text-xs">Support</h4>
          <ul className="space-y-4 text-white/50 text-[15px] font-normal">
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Help Center</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Community</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">FAQs</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Contact Us</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Status Page</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-8 text-white uppercase tracking-widest text-xs">More</h4>
          <ul className="space-y-4 text-white/50 text-[15px] font-normal">
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Terms of Service</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Cookie Policy</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Affiliates</li>
            <li className="hover:text-[#FF6636] transition-colors cursor-pointer">Partnerships</li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-white/30 text-sm font-normal">
        <p>© 2026 LearnTrack. All rights reserved.</p>
        <div className="flex items-center gap-8 mt-4 md:mt-0">
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            English
          </span>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;