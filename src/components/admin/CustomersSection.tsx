import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Package,
  Hash,
  RefreshCw,
  Truck
} from 'lucide-react';

interface Customer {
  id: number;
  created_at: string;
  price: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  postal?: string;
  phone: string;
  email: string;
  notes: string;
  details: string;
  pago: boolean;
  pago_id: string | null;
}

interface OrderItem {
  name: string;
  console: string;
  category: string;
  price: string;
  quantity: string;
}

const CustomersSection: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<number | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://n8n.alliasoft.com/webhook/konisgamesandmore/clientes'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data: Customer[] = await response.json();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load customers. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CORRECCIÓN: Separar por coma simple (sin espacio) y limpiar espacios en blanco (trim)
  const parseOrderDetails = (details: string): OrderItem[] => {
    if (!details) return [];

    return details.split(';').map((item) => {
      const parts = item.split(','); // Separar solo por coma
      return {
        name: parts[0]?.trim() || 'Unknown Game',
        console: parts[1]?.trim() || '',
        category: parts[2]?.trim() || '',
        price: parts[3]?.trim() || '0',
        quantity: parts[4]?.trim() || '1',
      };
    }).filter(item => item.name !== 'Unknown Game' && item.name !== ''); // Filtrar vacíos
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 1. Filtrar
  // 2. CORRECCIÓN: Ordenar de mayor a menor ID (más recientes primero)
  const filteredAndSortedCustomers = customers
    .filter((customer) => {
      const query = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.address.toLowerCase().includes(query) ||
        (customer.city && customer.city.toLowerCase().includes(query)) ||
        (customer.state && customer.state.toLowerCase().includes(query)) ||
        (customer.postal && customer.postal.includes(query)) ||
        customer.id.toString().includes(query)
      );
    })
    .sort((a, b) => b.id - a.id); // Reverse order: Newest first

  const toggleCustomerDetails = (customerId: number) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-8 rounded-2xl text-center shadow-lg">
        <p className="text-xl font-bold mb-3 text-red-400">Connection Error</p>
        <p className="text-gray-300 mb-6">{error}</p>
        <button
          onClick={loadCustomers}
          className="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <User className="w-6 h-6" />
            </span>
            Customer Orders
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage and view recent customer purchases.</p>
        </div>
        <button
          onClick={loadCustomers}
          className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700/50 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh List
        </button>
      </div>

      {/* Buscador */}
      <div className="relative group">
        <input
          type="text"
          placeholder="Search by name, email, order ID, address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-950/60 border border-gray-700/50 text-white p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-500 shadow-inner"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
      </div>

      {/* Lista de Clientes */}
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-10">
        {filteredAndSortedCustomers.length === 0 ? (
          <div className="text-center bg-gray-800/20 border border-gray-800/80 border-dashed rounded-3xl py-16 flex flex-col items-center">
            <Search className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium text-lg">No orders found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          filteredAndSortedCustomers.map((customer) => {
            const orderItems = parseOrderDetails(customer.details);
            const isExpanded = expandedCustomer === customer.id;
            
            // CORRECCIÓN: Cálculos matemáticos precisos
            const totalOrderValue = Number(customer.price) / 100;
            
            // Suma del precio de los juegos * cantidad
            const itemsSubtotal = orderItems.reduce((sum, item) => {
              return sum + (Number(item.price) * Number(item.quantity));
            }, 0);
            
            // Envío = Total cobrado - Subtotal de items
            // Usamos Math.max para evitar números negativos por errores de redondeo
            const shippingCost = Math.max(0, totalOrderValue - itemsSubtotal);

            return (
              <div
                key={customer.id}
                className="bg-gray-800/40 border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {customer.name}
                        </h3>
                        <span className="flex items-center gap-1 bg-gray-900/60 border border-gray-700/50 px-2.5 py-1 rounded-md text-gray-400 text-xs font-mono">
                          <Hash className="w-3 h-3" /> {customer.id}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            customer.pago
                              ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                          }`}
                        >
                          {customer.pago ? 'PAID' : 'PENDING'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4 text-indigo-400/70" />
                          {formatDate(customer.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-green-400 font-bold">
                          <DollarSign className="w-4 h-4" />
                          {totalOrderValue.toFixed(2)} Total
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 truncate pr-2" title={customer.email}>
                          <Mail className="w-4 h-4 text-indigo-400/70" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4 text-indigo-400/70" />
                          {customer.phone}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCustomerDetails(customer.id)}
                      className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gray-900/50 hover:bg-gray-700 border border-gray-700/50 text-gray-300 px-5 py-2.5 rounded-xl font-medium transition-colors"
                    >
                      {isExpanded ? (
                        <><EyeOff className="w-4 h-4" /> Hide Details</>
                      ) : (
                        <><Eye className="w-4 h-4" /> View Details</>
                      )}
                    </button>
                  </div>

                  {/* Resumen de Items Minimizado (Más limpio) */}
                  {!isExpanded && (
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-700/30">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-900/50 px-2.5 py-1.5 rounded-lg border border-gray-800">
                        <Package className="w-3.5 h-3.5" />
                        {orderItems.length} {orderItems.length !== 1 ? 'items' : 'item'}
                      </div>
                      {orderItems.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className="bg-gray-800 border border-gray-700/50 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 flex gap-1.5"
                        >
                          <span className="truncate max-w-[150px]">{item.name}</span>
                          <span className="text-indigo-400 font-bold">x{item.quantity}</span>
                        </span>
                      ))}
                      {orderItems.length > 3 && (
                        <span className="bg-gray-800/50 border border-gray-700/30 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500">
                          +{orderItems.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Detalles Expandidos */}
                {isExpanded && (
                  <div className="border-t border-gray-700/50 bg-gray-900/30 p-5 sm:p-6 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Información de Envío */}
                      <div className="space-y-5">
                        <h4 className="text-sm font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          Shipping Information
                        </h4>
                        
                        <div className="bg-gray-950/40 rounded-xl p-4 border border-gray-800/50 space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery Address</p>
                              <div className="text-gray-200 text-sm leading-relaxed">
                                <p>{customer.address}</p>
                                {(customer.city || customer.state || customer.postal) && (
                                  <p>{[customer.city, customer.state, customer.postal].filter(Boolean).join(', ')}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {customer.notes && (
                            <div className="flex items-start gap-3 pt-3 border-t border-gray-800/50">
                              <FileText className="w-5 h-5 text-yellow-500/70 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer Notes</p>
                                <p className="text-yellow-100/70 text-sm italic">"{customer.notes}"</p>
                              </div>
                            </div>
                          )}

                          {customer.pago_id && (
                            <div className="flex items-start gap-3 pt-3 border-t border-gray-800/50">
                              <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Transaction ID</p>
                                <p className="text-gray-400 font-mono text-xs bg-gray-900 px-2 py-1 rounded inline-block border border-gray-800">
                                  {customer.pago_id}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Detalles de los Artículos y Totales */}
                      <div className="space-y-5">
                        <h4 className="text-sm font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          Order Items
                        </h4>
                        
                        <div className="space-y-3">
                          {/* Lista de Juegos */}
                          {orderItems.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex-1">
                                <h5 className="font-bold text-gray-200 mb-1.5">{item.name}</h5>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  {item.console && <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700/50">{item.console}</span>}
                                  {item.category && <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700/50">{item.category}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-right bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800">
                                <div className="text-xs text-gray-500">
                                  Qty: <span className="text-gray-300 font-bold">{item.quantity}</span>
                                </div>
                                <div className="text-green-400 font-bold text-sm w-16 text-right">
                                  ${Number(item.price).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Resumen de Costos (Subtotal, Envío, Total) */}
                          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-indigo-500/20 mt-4 shadow-inner space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">Items Subtotal:</span>
                              <span className="text-gray-300 font-medium">${itemsSubtotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-700/50">
                              <span className="text-gray-400 flex items-center gap-1.5">
                                <Truck className="w-4 h-4" /> Shipping & Handling:
                              </span>
                              <span className="text-gray-300 font-medium">
                                {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}
                              </span>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                              <span className="text-gray-200 font-bold">Total Paid:</span>
                              <span className="text-2xl font-bold text-green-400">
                                ${totalOrderValue.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomersSection;