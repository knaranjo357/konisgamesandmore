import React, { useState } from 'react';
import { Game, PriceCategory } from '../types';
import { X, ShoppingCart, Trash } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { useCart } from '../context/CartContext';

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  const { addToCart, removeFromCart, items } = useCart();
  const [selectedType, setSelectedType] = useState<PriceCategory>('price1');
  const images = [game.imageUrl, game.imageUrl2, game.imageUrl3].filter(url => url && url !== '');

  // Get all available prices and sort them
  const getPrices = () => {
    return ['price1', 'price2', 'price3', 'price4', 'price5']
      .map(field => {
        const value = game[field as keyof Game];
        if (value) {
          const [name, price] = value.split('-');
          return {
            value: field as PriceCategory,
            label: name,
            price: Number(price)
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.price - b.price);
  };

  const handleAddToCart = () => {
    addToCart(game, selectedType);
  };

  const handleRemoveFromCart = (type: PriceCategory) => {
    removeFromCart(game.id, type);
  };

  const cartItems = items.filter(item => item.id === game.id);
  const prices = getPrices();

  // Set initial selected type
  React.useEffect(() => {
    if (prices.length > 0) {
      setSelectedType(prices[0].value);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{game.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <ImageCarousel images={images} alt={game.name} />
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Console</h3>
                <p className="text-purple-400">{game.console}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300">{game.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Add to Cart</h3>
                <div className="space-y-4">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as PriceCategory)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {prices.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label} - ${item.price}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {cartItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">In Cart</h3>
                  <div className="space-y-2">
                    {cartItems.map(item => {
                      const [categoryName] = game[item.selectedType].split('-');
                      return (
                        <div 
                          key={`${item.id}-${item.selectedType}`}
                          className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                        >
                          <div>
                            <span className="text-gray-200">
                              {categoryName}
                            </span>
                            <span className="text-purple-400 ml-2">x{item.quantity}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.selectedType)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;