import { Routes, Route, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import AboutPage from './pages/AboutPage';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0C0C0C]">
      <div className="w-48">
        <div className="mb-4 text-center font-display text-[14px] tracking-[0.1em] text-[#777777] uppercase">
          Loading
        </div>
        <div className="h-[2px] w-full bg-[#222222]">
          <div
            className="h-full bg-[#D24E35]"
            style={{
              animation: 'loading 1.5s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; margin-left: 0; }
            50% { width: 100%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      <CustomCursor />
      <Navigation />

      {loading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      )}

      {!loading && <Footer />}
    </div>
  );
}
