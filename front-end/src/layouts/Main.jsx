import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Main = ({ children }) => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#FF6636]/30 selection:text-[#FF6636] bg-white">
      <Header />
      <main className="flex-grow animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};