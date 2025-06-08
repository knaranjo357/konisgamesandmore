import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    notas: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    const value = item[item.selectedType];
    if (value && typeof value === 'string') {
      const [, price] = value.split('-');
      return sum + (Number(price) * item.quantity);
    }
    return sum;
  }, 0);

  const shipping = 4.00;
  const total = subtotal + shipping;

  const handleCheckoutFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const generateOrderDetails = () => {
    return items.map(item => {
      const value = item[item.selectedType];
      const [categoryName, price] = value ? value.split('-') : ['', '0'];
      return `${item.name}, ${item.console}, ${categoryName}, ${price}, ${item.quantity}`;
    }).join(';');
  };

  const handleCheckout = async () => {
    if (!checkoutForm.nombre || !checkoutForm.direccion || !checkoutForm.telefono || !checkoutForm.correo) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderDetails = generateOrderDetails();
      
      const response = await fetch('https://n8n.alliasoft.com/webhook/konisgamesandmore/stripe_crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          precio: Math.round(total * 100), // Convert to cents
          nombre: checkoutForm.nombre,
          direccion: checkoutForm.direccion,
          telefono: checkoutForm.telefono,
          correo: checkoutForm.correo,
          notas: checkoutForm.notas,
          detalles: orderDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment link');
      }

      const data = await response.json();
      if (data && data[0] && data[0].url) {
        // Redirect to Stripe payment page
        window.open(data[0].url, '_blank');
      } else {
        throw new Error('Invalid response from payment service');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
          {!showCheckout ? (
            <>
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {items.map(item => {
                  const value = item[item.selectedType];
                  const [categoryName, price] = value ? value.split('-') : ['', '0'];
                  
                  return (
                    <div key={`${item.id}-${item.selectedType}`} className="bg-gray-800 rounded-lg p-4 flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logokonisgames.png';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.console}</p>
                        <p className="text-gray-400 text-sm">{categoryName}</p>
                        <p className="text-purple-400 font-medium">${price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedType, item.quantity - 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedType, item.quantity + 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedType)}
                            className="ml-auto text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-800 mt-6 pt-6">
                <div className="space-y-2 text-white mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back to Cart
                </button>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Processing...
                  </span>
                ) : (
                  `Pay $${total.toFixed(2)} with Stripe`
                )}
              </button>
              <h3 className="text-lg font-bold text-white mb-4">Checkout Information</h3>
              
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={checkoutForm.nombre}
                    onChange={handleCheckoutFormChange}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={checkoutForm.direccion}
                    onChange={handleCheckoutFormChange}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={checkoutForm.telefono}
                    onChange={handleCheckoutFormChange}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={checkoutForm.correo}
                    onChange={handleCheckoutFormChange}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notas"
                    value={checkoutForm.notas}
                    onChange={handleCheckoutFormChange}
                    rows={3}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="space-y-2 text-white mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;