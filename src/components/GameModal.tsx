// src/components/GameModal.tsx
import React, { useState, useEffect } from 'react';
import { Game, PriceCategory } from '../types';
import { X, ShoppingCart, Trash, Gamepad2, ArrowRight } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { useCart } from '../context/CartContext';

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  const { addToCart, removeFromCart, items, isCartOpen, toggleCart } = useCart();
  const [selectedType, setSelectedType] = useState<PriceCategory>('price1');
  const images = [game.imageUrl, game.imageUrl2, game.imageUrl3].filter(
    (url) => url && url !== ''
  );

  const handleGoToCart = () => {
    onClose();
    if (!isCartOpen) {
      toggleCart();
    }
  };

  const handleAddToCart = () => {
    addToCart(game, selectedType);
  };

  const handleRemoveFromCart = (type: PriceCategory) => {
    removeFromCart(game.id, type);
  };

  const getPrices = () => {
    return (
      ['price1', 'price2', 'price3', 'price4', 'price5', 'price6', 'price7', 'price8'] as PriceCategory[]
    )
      .map((field) => {
        const value = game[field];
        if (!value) return null;
        const [name, price] = value.split('-');
        return { value: field, label: name, price: Number(price) };
      })
      .filter(
        (x): x is { value: PriceCategory; label: string; price: number } => !!x
      )
      .sort((a, b) => a.price - b.price);
  };

  const prices = getPrices();
  const cartItems = items.filter((item) => item.id === game.id);

  useEffect(() => {
    if (prices.length > 0) {
      setSelectedType(prices[0].value);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-800 border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/40 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header Sticky */}
        <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{game.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-gray-400 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Carousel */}
            <div>
              <div className="relative group aspect-[3/4] w-full overflow-hidden bg-black rounded-xl shadow-lg border border-white/5">
                <ImageCarousel images={images} alt={game.name} />
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col">
              
              {/* Console Badge */}
              <div className="mb-6 flex items-center gap-2">
                <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <Gamepad2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">System</h3>
                  <p className="text-purple-300 font-medium text-lg">{game.console}</p>
                </div>
              </div>

              <div className="mb-8 p-6 bg-gray-900/50 rounded-xl border border-white/5 shadow-inner">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  Select Option
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as PriceCategory)}
                      className="w-full bg-gray-800 text-white pl-4 pr-10 py-4 rounded-xl border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer text-lg"
                    >
                      {prices.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} – ${item.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Items currently in cart */}
              {cartItems.length > 0 && (
                <div className="mb-8 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Currently in Cart
                    </h3>
                    <button
                      onClick={handleGoToCart}
                      className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1 hover:underline transition-all"
                    >
                      Go to Checkout <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const [name] = game[item.selectedType].split('-');
                      return (
                        <div
                          key={`${item.id}-${item.selectedType}`}
                          className="flex justify-between items-center bg-gray-800 border border-gray-700 p-4 rounded-xl transition-colors hover:border-gray-600"
                        >
                          <div className="flex items-center gap-3">
                             <div className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">x{item.quantity}</div>
                             <span className="text-gray-200 font-medium">{name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.selectedType)}
                            className="group p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove from cart"
                          >
                            <Trash className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description Section */}
              <div className="mt-auto">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Description
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-base">
                    {game.description}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;