// src/components/Cart.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, CreditCard, ShoppingBag, ArrowLeft, Trash2, ShieldCheck, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface SubmittedItem {
  name: string;
  console: string;
  categoryName: string;
  price: number;
  quantity: number;
}

interface SubmittedOrder {
  items: SubmittedItem[];
  subtotal: number;
  shipping: number;
  total: number;
  email: string;
}

const Cart: React.FC = () => {
  const { items, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    nombre: '',
    direccion: '',
    city: '',
    state: '',
    postal: '',
    telefono: '',
    correo: '',
    notas: ''
  });
  const [errors, setErrors] = useState<{
    [K in keyof typeof checkoutForm]?: string
  }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  // Totals
  const subtotal = items.reduce((sum, item) => {
    const value = item[item.selectedType];
    if (value && typeof value === 'string') {
      const [, price] = value.split('-');
      return sum + Number(price) * item.quantity;
    }
    return sum;
  }, 0);
  const shipping = 4.0;
  const total = subtotal + shipping;

  const handleCheckoutFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!checkoutForm.nombre.trim()) newErrors.nombre = 'Name is required';
    if (!checkoutForm.direccion.trim()) newErrors.direccion = 'Address is required';
    if (!checkoutForm.city.trim()) newErrors.city = 'City is required';
    if (!checkoutForm.state.trim()) newErrors.state = 'State is required';
    if (!checkoutForm.postal.trim()) newErrors.postal = 'Postal code is required';
    if (!checkoutForm.telefono.trim()) {
      newErrors.telefono = 'Phone is required';
    } else if (checkoutForm.telefono.length < 6) {
      newErrors.telefono = 'Phone must be at least 6 digits';
    }
    if (!checkoutForm.correo.trim()) {
      newErrors.correo = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.correo)) {
      newErrors.correo = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSubmittedOrder = (): SubmittedOrder => {
    const submittedItems: SubmittedItem[] = items.map(item => {
      const value = item[item.selectedType];
      const [categoryName, priceStr] = value ? value.split('-') : ['', '0'];
      return {
        name: item.name,
        console: item.console,
        categoryName,
        price: Number(priceStr),
        quantity: item.quantity
      };
    });
    return {
      items: submittedItems,
      subtotal,
      shipping,
      total,
      email: checkoutForm.correo
    };
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        'https://n8n.alliasoft.com/webhook/konisgamesandmore/stripe_crear',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            precio: Math.round(total * 100),
            nombre: checkoutForm.nombre,
            direccion: checkoutForm.direccion,
            city: checkoutForm.city,
            state: checkoutForm.state,
            postal: checkoutForm.postal,
            telefono: checkoutForm.telefono,
            correo: checkoutForm.correo,
            notas: checkoutForm.notas,
            detalles: items
              .map(item => {
                const value = item[item.selectedType];
                const [cat, pr] = value ? value.split('-') : ['', '0'];
                return `${item.name},${item.console},${cat},${pr},${item.quantity}`;
              })
              .join(';')
          })
        }
      );
      if (!response.ok) throw new Error('Failed to create payment link');
      const data = await response.json();
      if (data?.[0]?.url) {
        const order = generateSubmittedOrder();
        setSubmittedOrder(order);
        items.forEach(i => removeFromCart(i.id, i.selectedType));
        setOrderSubmitted(true);
        window.open(data[0].url, '_blank');
      } else {
        throw new Error('Invalid response from payment service');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    setOrderSubmitted(false);
    setShowCheckout(false);
    setCheckoutForm({
      nombre: '',
      direccion: '',
      city: '',
      state: '',
      postal: '',
      telefono: '',
      correo: '',
      notas: ''
    });
    setErrors({});
    setSubmittedOrder(null);
  };

  useEffect(() => {
    if (!isCartOpen) {
      handleContinue();
    }
  }, [isCartOpen]);

  // Styles for inputs
  const inputClass = (error?: string) => `
    w-full bg-gray-800 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'} 
    text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 
    ${error ? 'focus:ring-red-500' : 'focus:ring-purple-500'} 
    transition-all placeholder-gray-500 text-sm
  `;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-white/10 animate-slide-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600/20 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {orderSubmitted ? 'Order Status' : showCheckout ? 'Checkout' : 'Your Cart'}
            </h2>
          </div>
          <button 
            onClick={toggleCart} 
            className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Processing Banner */}
        {isProcessing && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-3 text-sm font-semibold animate-pulse shadow-lg z-20">
            Securely processing your payment details...
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-900 to-gray-800">
          
          {/* Order Success State */}
          {orderSubmitted && submittedOrder ? (
            <div className="p-8 flex flex-col h-full items-center text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                <ShieldCheck className="w-10 h-10 text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Order Initiated!</h3>
              <p className="text-gray-400 mb-8 max-w-xs">
                Please complete payment in the new tab. A confirmation will be sent to <span className="text-purple-400 font-medium">{submittedOrder.email}</span>
              </p>

              <div className="w-full bg-gray-800/50 rounded-xl p-6 border border-white/5 mb-6 text-left">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Order Summary</h4>
                <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                  {submittedOrder.items.map((itm, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-300 truncate pr-4">
                        {itm.quantity}x {itm.name} <span className="text-gray-500 text-xs">({itm.categoryName})</span>
                      </span>
                      <span className="text-white font-medium">${(itm.price * itm.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-700 space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Shipping</span>
                    <span>${submittedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${submittedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="mt-auto w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold transition-all border border-white/10 hover:border-white/20"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Empty Cart State */}
              {items.length === 0 && !showCheckout ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-60">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-300 text-lg font-medium">Your cart is currently empty</p>
                  <p className="text-gray-500 text-sm mt-2">Looks like you haven't added any games yet.</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-8 px-6 py-2 bg-purple-600/20 text-purple-400 rounded-full hover:bg-purple-600 hover:text-white transition-all text-sm font-semibold"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  {!showCheckout ? (
                    <div className="p-6 space-y-4">
                      {items.map(item => {
                        const value = item[item.selectedType];
                        const [categoryName, price] = value ? value.split('-') : ['', '0'];
                        
                        return (
                          <div
                            key={`${item.id}-${item.selectedType}`}
                            className="group bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 hover:border-purple-500/30 rounded-xl p-3 flex gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
                          >
                            <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                onError={e => ((e.target as HTMLImageElement).src = '/logokonisgames.png')}
                              />
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div>
                                <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-1">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                                    {item.console}
                                  </span>
                                  <span className="text-xs text-gray-400 truncate max-w-[100px]">{categoryName}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-purple-400 font-bold">${price}</span>
                                
                                <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-700">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.selectedType, item.quantity - 1)}
                                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-white text-xs font-medium w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.selectedType, item.quantity + 1)}
                                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id, item.selectedType)}
                              className="self-start p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Checkout Form */
                    <div className="p-6 space-y-6">
                      <button
                        onClick={() => setShowCheckout(false)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-medium"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Cart
                      </button>
                      
                      <div className="space-y-4">
                        {/* Personal Info Group */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Contact Info
                          </h3>
                          <div>
                            <input
                              type="text"
                              name="nombre"
                              placeholder="Full Name *"
                              value={checkoutForm.nombre}
                              onChange={handleCheckoutFormChange}
                              className={inputClass(errors.nombre)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <input
                                  type="email"
                                  name="correo"
                                  placeholder="Email *"
                                  value={checkoutForm.correo}
                                  onChange={handleCheckoutFormChange}
                                  className={inputClass(errors.correo)}
                                />
                             </div>
                             <div>
                                <input
                                  type="tel"
                                  name="telefono"
                                  placeholder="Phone *"
                                  value={checkoutForm.telefono}
                                  onChange={e => {
                                    const nums = e.target.value.replace(/\D/g, '');
                                    setCheckoutForm(prev => ({ ...prev, telefono: nums }));
                                    setErrors(prev => ({ ...prev, telefono: undefined }));
                                  }}
                                  className={inputClass(errors.telefono)}
                                />
                             </div>
                          </div>
                        </div>

                        {/* Shipping Group */}
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Shipping Address
                          </h3>
                          <div>
                            <input
                              type="text"
                              name="direccion"
                              placeholder="Street Address *"
                              value={checkoutForm.direccion}
                              onChange={handleCheckoutFormChange}
                              className={inputClass(errors.direccion)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              name="city"
                              placeholder="City *"
                              value={checkoutForm.city}
                              onChange={handleCheckoutFormChange}
                              className={inputClass(errors.city)}
                            />
                             <input
                              type="text"
                              name="state"
                              placeholder="State *"
                              value={checkoutForm.state}
                              onChange={handleCheckoutFormChange}
                              className={inputClass(errors.state)}
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              name="postal"
                              placeholder="Postal / Zip Code *"
                              value={checkoutForm.postal}
                              onChange={handleCheckoutFormChange}
                              className={inputClass(errors.postal)}
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="pt-4 border-t border-gray-800">
                          <textarea
                            name="notas"
                            placeholder="Order Notes (Optional)"
                            value={checkoutForm.notas}
                            onChange={handleCheckoutFormChange}
                            rows={2}
                            className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500 text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!orderSubmitted && items.length > 0 && (
          <div className="p-6 bg-gray-900 border-t border-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-20">
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-gray-800">
                <span>Total</span>
                <span className="text-purple-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 ${
                  isProcessing ? 'opacity-70 cursor-wait' : 'transform active:scale-95'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" /> Pay Now
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;