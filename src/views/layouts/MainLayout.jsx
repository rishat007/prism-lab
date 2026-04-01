/**
 * Main site layout - Navbar, Breadcrumb, Hero (Home full-width / PRISM Lab), Sidebar, Main content, Footer
 */
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import HeroSection from '../components/HeroSection';
import HomeHeroSection from '../components/HomeHeroSection';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '' || location.pathname === '/index.html';
  const isPrismLab = location.pathname === '/prism-lab';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  function handleBackToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-root">
      <Navbar />
      <Breadcrumb />
      {isHome && <HomeHeroSection />}
      {isPrismLab && <HeroSection />}
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <button type="button" className="app-back-to-top" onClick={handleBackToTop}>
        Back to top
      </button>
      <Footer />
    </div>
  );
}
