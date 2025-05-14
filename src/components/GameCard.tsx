import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Game, PRICE_CATEGORIES, PriceCategory } from '../types';
import { useCart } from '../context/CartContext';

interface GameCardProps {
  game: Game;
  bestSeller?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, bestSeller = false }) => {
  const { addToCart } = useCart();
  const [selectedType, setSelectedType] = useState<PriceCategory>('game');

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <Star className="absolute top-0 left-0 w-4 h-4 text-yellow-400 fill-yellow-400 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
      );
    }
    
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(game, selectedType);
  };

  const getCurrentPrice = () => {
    return game[selectedType];
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
      {bestSeller && (
        <div className="bg-purple-600 text-white px-3 py-1 absolute top-3 left-3 rounded-full text-xs font-semibold z-10">
          Best Seller
        </div>
      )}
      <div className="relative overflow-hidden h-48">
        <img 
          src={game.imageUrl} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <div className="absolute bottom-3 left-3 flex items-center space-x-1">
          {renderRating(Number(game.rating))}
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm text-purple-400 mb-1">{game.console}</div>
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{game.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>
        <div className="space-y-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as PriceCategory)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {PRICE_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label} - ${game[category.value]}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Add to Cart - ${getCurrentPrice()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;