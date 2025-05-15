import React, { useState, useEffect } from 'react';
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
  const [availableCategories, setAvailableCategories] = useState(PRICE_CATEGORIES);

  useEffect(() => {
    // Filter categories that have prices
    const categories = PRICE_CATEGORIES.filter(category => {
      const price = game[category.value];
      return price && price !== '0' && price !== '';
    });

    // Add custom categories if they exist
    ['price1', 'price2', 'price3'].forEach(field => {
      const value = game[field as keyof Game];
      if (value && typeof value === 'string') {
        const [name, price] = value.split('-');
        if (name && price) {
          categories.push({
            value: field as PriceCategory,
            label: name
          });
        }
      }
    });

    setAvailableCategories(categories);
    
    // Set initial selected type to the first available category
    if (categories.length > 0 && (!selectedType || !game[selectedType])) {
      setSelectedType(categories[0].value);
    }
  }, [game]);

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
    if (selectedType.startsWith('price')) {
      const value = game[selectedType as keyof Game];
      if (typeof value === 'string') {
        const [, price] = value.split('-');
        return price;
      }
    }
    return game[selectedType];
  };

  if (availableCategories.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
      <div className="relative overflow-hidden h-48">
        <img 
          src={game.imageUrl} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        {/* <div className="absolute bottom-3 left-3 flex items-center space-x-1">
          {renderRating(Number(game.rating))}
        </div> */}
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
            {availableCategories.map(category => {
              const price = category.value.startsWith('price') 
                ? game[category.value as keyof Game]?.split('-')[1]
                : game[category.value];
              
              return (
                <option key={category.value} value={category.value}>
                  {category.label} - ${price}
                </option>
              );
            })}
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