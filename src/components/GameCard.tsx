import React, { useState, useEffect } from 'react';
import { Game, PRICE_CATEGORIES, PriceCategory } from '../types';
import { useCart } from '../context/CartContext';
import ImageCarousel from './ImageCarousel';
import { ShoppingCart, Trash } from 'lucide-react';

interface GameCardProps {
  game: Game;
  bestSeller?: boolean;
  onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, bestSeller = false, onClick }) => {
  const { addToCart, removeFromCart, items } = useCart();
  const [selectedType, setSelectedType] = useState<PriceCategory>('price1');
  const [availableCategories, setAvailableCategories] = useState<typeof PRICE_CATEGORIES>([]);
  const cartItem = items.find(item => item.id === game.id);

  useEffect(() => {
    const categories = ['price1', 'price2', 'price3', 'price4', 'price5']
      .map(field => ({
        value: field as PriceCategory,
        label: game[field as keyof Game]?.split('-')[0] || ''
      }))
      .filter(category => category.label !== '');

    // Sort categories by price
    categories.sort((a, b) => {
      const priceA = Number(game[a.value as keyof Game]?.split('-')[1] || 0);
      const priceB = Number(game[b.value as keyof Game]?.split('-')[1] || 0);
      return priceA - priceB;
    });

    setAvailableCategories(categories);
    
    if (categories.length > 0) {
      setSelectedType(categories[0].value);
    }
  }, [game]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(game, selectedType);
  };

  const handleRemoveFromCart = (e: React.MouseEvent, type: PriceCategory) => {
    e.stopPropagation();
    removeFromCart(game.id, type);
  };

  const getCurrentPrice = () => {
    const value = game[selectedType];
    if (value) {
      const [, price] = value.split('-');
      return price;
    }
    return '0';
  };

  if (availableCategories.length === 0) return null;

  const images = [game.imageUrl, game.imageUrl2, game.imageUrl3].filter(url => url && url !== '');

  return (
    <div 
      className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group cursor-pointer"
      onClick={onClick}
    >
      <ImageCarousel images={images} alt={game.name} />
      <div className="p-4">
        <div className="text-sm text-purple-400 mb-1">{game.console}</div>
        <h3 className="text-[1rem] font-semibold text-white mb-2 line-clamp-1">{game.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>
        <div className="space-y-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as PriceCategory)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={(e) => e.stopPropagation()}
          >
            {availableCategories.map(category => {
              const [name, price] = game[category.value].split('-');
              return (
                <option key={category.value} value={category.value}>
                  {name} - ${price}
                </option>
              );
            })}
          </select>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart - ${getCurrentPrice()}
          </button>
        </div>

        {/* Cart Items Section */}
        {items.filter(item => item.id === game.id).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">In Cart:</h4>
            <div className="space-y-2">
              {items
                .filter(item => item.id === game.id)
                .map(item => {
                  const [categoryName] = game[item.selectedType].split('-');
                  return (
                    <div 
                      key={`${item.id}-${item.selectedType}`}
                      className="flex items-center justify-between bg-gray-700/50 p-2 rounded"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="text-sm text-gray-300">
                        {categoryName}
                        <span className="text-purple-400 ml-2">x{item.quantity}</span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveFromCart(e, item.selectedType)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;