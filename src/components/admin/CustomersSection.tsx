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
} from 'lucide-react';
import AnalyticsReport from './AnalyticsReport';

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

  const parseOrderDetails = (details: string): OrderItem[] => {
    if (!details) return [];

    return details.split(';').map((item) => {
      const parts = item.split(', ');
      return {
        name: parts[0] || '',
        console: parts[1] || '',
        category: parts[2] || '',
        price: parts[3] || '0',
        quantity: parts[4] || '1',
      };
    });
  };

  const calculateTotal = (price: string): number => {
    const subtotal = Number(price) / 100; // Convert from cents
    const shipping = 4.0;
    return subtotal + shipping;
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

  const filteredCustomers = customers.filter((customer) => {
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
  });

  const toggleCustomerDetails = (customerId: number) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-200 p-6 rounded-lg text-center">
        <p className="text-lg font-medium mb-2">Error Loading Customers</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={loadCustomers}
          className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Customer Orders</h2>
        <button
          onClick={loadCustomers}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search customers by name, email, phone, address, city, state, postal code, or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            {searchQuery
              ? 'No customers found matching your search'
              : 'No customers found'}
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const orderItems = parseOrderDetails(customer.details);
            const total = calculateTotal(customer.price);
            const isExpanded = expandedCustomer === customer.id;

            return (
              <div
                key={customer.id}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-purple-400" />
                        <h3 className="text-xl font-semibold text-white">
                          {customer.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm font-mono">
                            #{customer.id}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.pago
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {customer.pago ? 'Paid' : 'Pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(customer.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <DollarSign className="w-4 h-4 text-gray-400" />$
                          {(Number(customer.price) / 100).toFixed(2)} total
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {customer.phone}
                        </div>
                      </div>

                      {/* Address Summary */}
                      <div className="mt-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {customer.address}
                        {customer.city && `, ${customer.city}`}
                        {customer.state && `, ${customer.state}`}
                        {customer.postal && ` ${customer.postal}`}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCustomerDetails(customer.id)}
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          View Details
                        </>
                      )}
                    </button>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Package className="w-4 h-4" />
                    {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {orderItems.slice(0, 3).map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300"
                      >
                        {item.name} ({item.quantity}x)
                      </span>
                    ))}
                    {orderItems.length > 3 && (
                      <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-400">
                        +{orderItems.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-700 p-6 bg-gray-750">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Customer Information */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-purple-400" />
                          Customer Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Hash className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">Order ID</p>
                              <p className="text-white font-mono">
                                #{customer.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">
                                Full Address
                              </p>
                              <div className="text-white">
                                <p>{customer.address}</p>
                                {customer.city &&
                                  customer.state &&
                                  customer.postal && (
                                    <p>
                                      {customer.city}, {customer.state}{' '}
                                      {customer.postal}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">Email</p>
                              <p className="text-white">{customer.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">Phone</p>
                              <p className="text-white">{customer.phone}</p>
                            </div>
                          </div>
                          {customer.notes && (
                            <div className="flex items-start gap-3">
                              <FileText className="w-4 h-4 text-gray-400 mt-1" />
                              <div>
                                <p className="text-sm text-gray-400">Notes</p>
                                <p className="text-white">{customer.notes}</p>
                              </div>
                            </div>
                          )}
                          {customer.pago_id && (
                            <div className="flex items-start gap-3">
                              <DollarSign className="w-4 h-4 text-gray-400 mt-1" />
                              <div>
                                <p className="text-sm text-gray-400">
                                  Payment ID
                                </p>
                                <p className="text-white font-mono text-sm">
                                  {customer.pago_id}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5 text-purple-400" />
                          Order Details
                        </h4>
                        <div className="space-y-3">
                          {orderItems.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-800 p-4 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-white">
                                  {item.name}
                                </h5>
                                <span className="text-purple-400 font-medium">
                                  ${item.price}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 space-y-1">
                                <p>Console: {item.console}</p>
                                <p>Category: {item.category}</p>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          ))}

                          {/* Order Summary */}
                          <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20">
                            <div className="space-y-2">
                              <div className="flex justify-between text-gray-300">
                                <span>Total:</span>
                                <span>
                                  ${(Number(customer.price) / 100).toFixed(2)}
                                </span>
                              </div>
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
      {/* <AnalyticsReport /> */}
    </div>
  );
};

export default CustomersSection;
