import React, { useState, useEffect } from 'react';
import { Game, PRICE_CATEGORIES, PriceCategory } from '../types';
import { useCart } from '../context/CartContext';
import ImageCarousel from './ImageCarousel';

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

  // Filter out empty image URLs
  const images = [game.imageUrl, game.imageUrl2, game.imageUrl3].filter(url => url && url !== '');

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
      <ImageCarousel images={images} alt={game.name} />
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