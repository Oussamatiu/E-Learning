import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Main Footer Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        {/* Logo */}
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#592b98] rounded flex items-center justify-center text-white font-bold text-base">L</div>
            <span className="text-lg font-bold text-gray-900">LearnTrack</span>
          </Link>
        </div>

        {/* LearnTrack */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">LearnTrack</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">About us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Investors</a></li>
          </ul>
        </div>

        {/* Discover */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Discover</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Browse Courses</a></li>
            <li><a href="#" className="hover:underline">Categories</a></li>
            <li><a href="#" className="hover:underline">Mentors</a></li>
            <li><a href="#" className="hover:underline">Learning Plans</a></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Community</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Learners</a></li>
            <li><a href="#" className="hover:underline">Instructors</a></li>
            <li><a href="#" className="hover:underline">Developers</a></li>
            <li><a href="#" className="hover:underline">Partners</a></li>
          </ul>
        </div>

        {/* More */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">More</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Teach on LearnTrack</a></li>
            <li><a href="#" className="hover:underline">Get the app</a></li>
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact us</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#592b98] rounded flex items-center justify-center text-white font-bold text-xs">L</div>
          <span className="text-sm text-gray-500">© 2026 LearnTrack, Inc.</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Cookie Settings</a>
          <a href="#" className="hover:underline">Sitemap</a>
          <a href="#" className="hover:underline">Accessibility</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            English
          </button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;