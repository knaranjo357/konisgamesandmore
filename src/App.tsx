import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ConsoleBrowser from './components/ConsoleBrowser';
import RequestForm from './components/RequestForm';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import Faq from './components/Faq';
import Cart from './components/Cart';
import Shop from './components/Shop';
import Admin from './components/Admin';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={
            <div className="min-h-screen bg-gray-900 text-white">
              <Header />
              <Cart />
              <Hero />
              <ConsoleBrowser />
              <Shop />
              <RequestForm />
              <InfoSection />
              <Faq />
              <Footer />
            </div>
          } />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;