// src/components/Cart.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
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

  // Handle form field changes
  const handleCheckoutFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
    // clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Validate before submitting
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!checkoutForm.nombre.trim()) newErrors.nombre = 'Name is required';
    if (!checkoutForm.direccion.trim()) newErrors.direccion = 'Address is required';
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

  // Prepare the submitted order summary
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

  // Handle the checkout button
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
        // Snapshot the order to display
        const order = generateSubmittedOrder();
        setSubmittedOrder(order);
        // Clear the cart
        items.forEach(i => removeFromCart(i.id, i.selectedType));
        // Show submitted state
        setOrderSubmitted(true);
        // Open Stripe
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

  // Reset everything to allow another order
  const handleContinue = () => {
    setOrderSubmitted(false);
    setShowCheckout(false);
    setCheckoutForm({
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      notas: ''
    });
    setErrors({});
    setSubmittedOrder(null);
  };

  // Whenever the cart closes, reset the checkout flow
  useEffect(() => {
    if (!isCartOpen) {
      handleContinue();
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-lg z-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
        <button onClick={toggleCart} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Processing banner */}
      {isProcessing && (
        <div className="bg-purple-600 text-white text-center py-2 mb-4 rounded">
          Processing payment...
        </div>
      )}

      {/* After submit: show summary */}
      {orderSubmitted && submittedOrder ? (
        <div className="flex-1 flex flex-col">
          <h3 className="text-white text-lg font-bold mb-4">Order Processing</h3>
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {submittedOrder.items.map((itm, idx) => (
              <div key={idx} className="flex justify-between text-white">
                <span>
                  {itm.name} ({itm.categoryName}) x{itm.quantity}
                </span>
                <span>${(itm.price * itm.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="border-gray-700" />
            <div className="flex justify-between text-white">
              <span>Subtotal:</span>
              <span>${submittedOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Shipping:</span>
              <span>${submittedOrder.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-white">
              <span>Total:</span>
              <span>${submittedOrder.total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-white mb-4">
            Thank you! We will contact you via email at{' '}
            <span className="font-semibold">{submittedOrder.email}</span>.
          </p>
          <button
            onClick={handleContinue}
            className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Empty cart */}
          {items.length === 0 && !showCheckout ? (
            <p className="text-gray-400 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              {/* Cart items view */}
              {!showCheckout ? (
                <>
                  <div className="space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-300px)]">
                    {items.map(item => {
                      const value = item[item.selectedType];
                      const [categoryName, price] = value
                        ? value.split('-')
                        : ['', '0'];
                      return (
                        <div
                          key={`${item.id}-${item.selectedType}`}
                          className="bg-gray-800 rounded-lg p-4 flex gap-4"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                            onError={e =>
                              ((e.target as HTMLImageElement).src =
                                '/logokonisgames.png')
                            }
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-medium">
                              {item.name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {item.console}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {categoryName}
                            </p>
                            <p className="text-purple-400 font-medium">
                              ${price}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedType,
                                    item.quantity - 1
                                  )
                                }
                                className="text-gray-400 hover:text-white"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedType,
                                    item.quantity + 1
                                  )
                                }
                                className="text-gray-400 hover:text-white"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  removeFromCart(
                                    item.id,
                                    item.selectedType
                                  )
                                }
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
                /* Checkout form */
                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ← Back to Cart
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    Checkout Information
                  </h3>
                  <div className="space-y-4">
                    {/** Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={checkoutForm.nombre}
                        onChange={handleCheckoutFormChange}
                        className={`w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                          errors.nombre
                            ? 'border-red-500 focus:ring-red-500'
                            : 'focus:ring-purple-500'
                        }`}
                      />
                      {errors.nombre && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.nombre}
                        </p>
                      )}
                    </div>
                    {/** Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={checkoutForm.direccion}
                        onChange={handleCheckoutFormChange}
                        className={`w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                          errors.direccion
                            ? 'border-red-500 focus:ring-red-500'
                            : 'focus:ring-purple-500'
                        }`}
                      />
                      {errors.direccion && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.direccion}
                        </p>
                      )}
                    </div>
                    {/** Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={checkoutForm.telefono}
                        onChange={e => {
                          const nums = e.target.value.replace(/\D/g, '');
                          setCheckoutForm(prev => ({
                            ...prev,
                            telefono: nums
                          }));
                          setErrors(prev => ({ ...prev, telefono: undefined }));
                        }}
                        className={`w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                          errors.telefono
                            ? 'border-red-500 focus:ring-red-500'
                            : 'focus:ring-purple-500'
                        }`}
                        placeholder="Digits only"
                      />
                      {errors.telefono && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.telefono}
                        </p>
                      )}
                    </div>
                    {/** Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="correo"
                        value={checkoutForm.correo}
                        onChange={handleCheckoutFormChange}
                        className={`w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                          errors.correo
                            ? 'border-red-500 focus:ring-red-500'
                            : 'focus:ring-purple-500'
                        }`}
                      />
                      {errors.correo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.correo}
                        </p>
                      )}
                    </div>
                    {/** Notes */}
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
                  </div>
                  <div className="border-t border-gray-700 pt-4 mt-4">
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
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
