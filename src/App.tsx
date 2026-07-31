import { Routes, Route, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Logo from './components/Logo';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import AboutPage from './pages/AboutPage';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-driftae-black">
      <div className="flex flex-col items-center">
        <Logo variant="full" className="animate-pulse" />
        <div className="mt-10 h-px w-48 overflow-hidden bg-driftae-border">
          <div
            className="h-full bg-driftae-gold"
            style={{ animation: 'loading 1.5s ease-in-out infinite' }}
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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-driftae-black">
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
