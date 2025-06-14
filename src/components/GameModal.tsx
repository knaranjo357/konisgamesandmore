// src/components/GameModal.tsx
import React, { useState, useEffect } from 'react';
import { Game, PriceCategory } from '../types';
import { X, ShoppingCart, Trash } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { useCart } from '../context/CartContext';

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  // Incluimos isCartOpen y toggleCart desde el contexto
  const { addToCart, removeFromCart, items, isCartOpen, toggleCart } = useCart();
  const [selectedType, setSelectedType] = useState<PriceCategory>('price1');
  const images = [game.imageUrl, game.imageUrl2, game.imageUrl3].filter(url => url && url !== '');

  // Maneja abrir siempre el carrito (sólo hace toggle si está cerrado)
  const handleGoToCart = () => {
    onClose();            // cierra el modal
    if (!isCartOpen) {    // si el carrito NO está abierto, lo abre
      toggleCart();
    }
  };

  const handleAddToCart = () => {
    addToCart(game, selectedType);
  };

  const handleRemoveFromCart = (type: PriceCategory) => {
    removeFromCart(game.id, type);
  };

  // Obtiene y ordena las categorías de precio disponibles
  const getPrices = () => {
    return (['price1','price2','price3','price4','price5'] as PriceCategory[])
      .map(field => {
        const value = game[field];
        if (!value) return null;
        const [name, price] = value.split('-');
        return { value: field, label: name, price: Number(price) };
      })
      .filter((x): x is { value: PriceCategory; label: string; price: number } => !!x)
      .sort((a, b) => a.price - b.price);
  };

  const prices = getPrices();
  const cartItems = items.filter(item => item.id === game.id);

  // Inicializa el select con la opción más barata
  useEffect(() => {
    if (prices.length > 0) {
      setSelectedType(prices[0].value);
    }
  }, [prices]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{game.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Carousel */}
            <div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <ImageCarousel images={images} alt={game.name} />
              </div>
            </div>

            {/* Details & Cart */}
            <div>
              {/* Console */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Console</h3>
                <p className="text-purple-400">{game.console}</p>
              </div>

              {/* Add to Cart */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Add to Cart</h3>
                <div className="space-y-4">
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value as PriceCategory)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {prices.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.label} – ${item.price}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Go to Cart button + Listado rápido */}
              {cartItems.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">In Cart</h3>
                    <button
                      onClick={handleGoToCart}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Go to Cart
                    </button>
                  </div>
                  <div className="space-y-2">
                    {cartItems.map(item => {
                      const [name] = game[item.selectedType].split('-');
                      return (
                        <div
                          key={`${item.id}-${item.selectedType}`}
                          className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                        >
                          <div>
                            <span className="text-gray-200">{name}</span>
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

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300">{game.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
