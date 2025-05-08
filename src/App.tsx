import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Search from './components/Search';
import ConsoleBrowser from './components/ConsoleBrowser';
import BestSellingGames from './components/BestSellingGames';
import RequestForm from './components/RequestForm';
import InfoSection from './components/InfoSection';
import TopRatedGames from './components/TopRatedGames';
import Footer from './components/Footer';
import Faq from './components/Faq';
import Cart from './components/Cart';
import Shop from './components/Shop';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <Cart />
        <Hero />
        <Shop />
        <ConsoleBrowser />
        <BestSellingGames />
        <RequestForm />
        <InfoSection />
        <TopRatedGames />
        <Faq />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;