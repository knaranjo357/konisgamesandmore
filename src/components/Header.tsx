import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, toggleCart } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-900/20' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-purple-600 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity duration-500"></div>
              <img 
                src="/logokonisgames.png" 
                alt="Konis Games and More" 
                className="h-14 w-auto relative z-10 drop-shadow-lg"
              />
            </div>
            <span className="text-white font-bold tracking-wide text-lg group-hover:text-purple-300 transition-colors">
              Konis<span className="text-purple-500">Games</span>
            </span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Browse Games', 'Shop Games'].map((text, idx) => {
              const href = ['#home', '#consoles', '#shop'][idx];
              return (
                <a 
                  key={text}
                  href={href} 
                  className="relative text-gray-300 hover:text-white text-sm font-semibold transition-all duration-300 group py-2"
                >
                  {text}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              );
            })}
            
            <button 
              onClick={toggleCart}
              className="relative group p-2 rounded-full hover:bg-white/5 transition-all duration-300"
            >
              <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-purple-400 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleCart}
              className="relative p-2"
            >
              <ShoppingCart className="w-6 h-6 text-gray-100" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-100 p-1"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-white/10 animate-fade-in-down">
          <nav className="flex flex-col p-4 space-y-2">
            {['Home', 'Browse Games', 'Shop Games'].map((text, idx) => {
               const href = ['#home', '#consoles', '#shop'][idx];
               return (
                <a 
                  key={text}
                  href={href} 
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {text}
                </a>
               );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;