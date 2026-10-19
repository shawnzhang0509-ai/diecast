import { Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import AboutPage from './pages/AboutPage';
import CollectionPage from './pages/CollectionPage';
import NotFound from './pages/NotFound';
import { ProductsProvider } from './context/ProductsContext';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-driftae-black">
      <Analytics />
      <CustomCursor />
      <Navigation />

      <ProductsProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ProductsProvider>

      <Footer />
    </div>
  );
}
