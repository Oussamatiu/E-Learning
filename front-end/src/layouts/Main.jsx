import Footer from "./Footer";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const Main = () => {
  const [id, setId] = useState(2);
  const location = useLocation();
  const pathname = location.pathname;
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  return (
    <div className="min-h-screen flex flex-col selection:bg-[#FF6636]/30 selection:text-[#FF6636] bg-white">
      <Header id={id} />
      <main className="flex-grow animate-fade-in">
        <Outlet context={{ id, setId }} />
      </main>
      <Footer />
    </div>
  );
};