import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import ConsoleBrowser from './components/ConsoleBrowser';
import RequestForm from './components/RequestForm';
import InfoSection from './components/InfoSection';
import Faq from './components/Faq';
import Cart from './components/Cart';
import Shop from './components/Shop';
import Admin from './components/Admin';
import SEO from './components/SEO';
import { CartProvider } from './context/CartContext';
import { AnalyticsListener } from './analytics';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <CartProvider>
          {/* Analytics listener escucha los cambios de ruta */}
          <AnalyticsListener />
          
          {/* SEO Global (carga por defecto) */}
          <SEO />

          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gray-900 text-white selection:bg-purple-500 selection:text-white">
                  <Header />
                  <Cart />
                  <main>
                    <Hero />
                    <ConsoleBrowser />
                    <Shop />
                    <RequestForm />
                    <InfoSection />
                    <Faq />
                  </main>
                </div>
              }
            />
          </Routes>
        </CartProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;