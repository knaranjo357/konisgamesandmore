import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useCart();

  const total = items.reduce((sum, item) => {
    return sum + (Number(item.price) * item.quantity);
  }, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-lg z-50 p-6 transform transition-transform">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
        <button
          onClick={toggleCart}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.console}</p>
                  <p className="text-purple-400 font-medium">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6">
            <div className="flex justify-between text-white mb-4">
              <span>Total:</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;