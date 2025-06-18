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
        isScrolled ? 'bg-gray-900/95 backdrop-blur-xl shadow-xl shadow-purple-500/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2 group">
            <img 
              src="/logokonisgames.png" 
              alt="Konis Games and More" 
              className="h-16 w-auto"
            />
            <span className="text-white font-medium">Reproduction</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <a href="#home" className="text-white/90 hover:text-purple-400 transition-all duration-300 text-sm font-medium hover:scale-105 transform">Home</a>
            <a href="#consoles" className="text-white/90 hover:text-purple-400 transition-all duration-300 text-sm font-medium hover:scale-105 transform">Browse Games</a>
            <a href="#shop" className="text-white/90 hover:text-purple-400 transition-all duration-300 text-sm font-medium hover:scale-105 transform">Shop Games</a>
            
            <button 
              onClick={toggleCart}
              className="relative text-white/90 hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleCart}
              className="relative text-white/90 hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/90 hover:text-purple-400 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl py-4 px-4 animate-fadeIn border-t border-gray-800/50">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#home" 
              className="text-white/90 hover:text-purple-400 transition-all duration-300 py-2 border-b border-gray-800/50 hover:pl-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#consoles" 
              className="text-white/90 hover:text-purple-400 transition-all duration-300 py-2 border-b border-gray-800/50 hover:pl-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Games
            </a>
            <a 
              href="#shop" 
              className="text-white/90 hover:text-purple-400 transition-all duration-300 py-2 border-b border-gray-800/50 hover:pl-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop Games
            </a>
            
            
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;