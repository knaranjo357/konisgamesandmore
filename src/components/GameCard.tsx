import React, { useState, useEffect } from 'react';
import { Game, PRICE_CATEGORIES, PriceCategory } from '../types';
import { useCart } from '../context/CartContext';
import ImageCarousel from './ImageCarousel';
import { ShoppingCart, Trash, Star } from 'lucide-react';

interface GameCardProps {
  game: Game;
  bestSeller?: boolean;
  onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  bestSeller = false,
  onClick,
}) => {
  const { addToCart, removeFromCart, items } = useCart();
  const [selectedType, setSelectedType] = useState<PriceCategory>('price1');
  const [availableCategories, setAvailableCategories] = useState<typeof PRICE_CATEGORIES>([]);
  
  useEffect(() => {
    const categories = ['price1', 'price2', 'price3', 'price4', 'price5', 'price6','price7', 'price8']
      .map((field) => ({
        value: field as PriceCategory,
        label: game[field as keyof Game]?.split('-')[0] || '',
      }))
      .filter((category) => category.label !== '');

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

  const handleRemoveFromCart = (e: React.MouseEvent, type: PriceCategory) => {
    e.stopPropagation();
    removeFromCart(game.id, type);
  };

  if (availableCategories.length === 0) return null;

  const images = [game.imageUrl, game.imageUrl2, game.imageUrl3].filter(url => url && url !== '');
  if (images.length === 0) images.push('https://konisgamesandmore.com/logokonisgames.png');

  // Check if item is in cart
  const cartItems = items.filter(item => item.id === game.id);
  const isInCart = cartItems.length > 0;

  return (
    <div
      className={`relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20 group cursor-pointer border border-white/5 hover:border-purple-500/30 flex flex-col h-full`}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900">
        <ImageCarousel images={images} alt={game.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
        
        {/* Console Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
           <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">{game.console}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
          {game.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
          {game.description}
        </p>

        {/* Price Tag (Visual Only as button removed) */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-gray-400 text-xs font-medium">Click for details</span>
          <div className="p-2 bg-purple-600/10 rounded-full group-hover:bg-purple-600 transition-colors">
            <ShoppingCart className="w-4 h-4 text-purple-400 group-hover:text-white" />
          </div>
        </div>

        {/* Cart Indicator */}
        {isInCart && (
          <div className="mt-3 bg-purple-900/30 border border-purple-500/20 rounded-lg p-2">
            <div className="flex items-center justify-between text-xs text-purple-200 mb-1">
              <span className="font-semibold">In Cart</span>
              <span className="bg-purple-500 text-white px-1.5 py-0.5 rounded text-[10px]">{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
            </div>
            <div className="space-y-1">
              {cartItems.map((item) => {
                 const [catName] = game[item.selectedType].split('-');
                 return (
                   <div key={`${item.id}-${item.selectedType}`} className="flex justify-between items-center text-[10px] text-gray-300 pl-1 border-l-2 border-purple-500/50">
                     <span className="truncate max-w-[80px]">{catName}</span>
                     <button onClick={(e) => handleRemoveFromCart(e, item.selectedType)} className="text-red-400 hover:text-red-300 p-1">
                       <Trash className="w-3 h-3" />
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