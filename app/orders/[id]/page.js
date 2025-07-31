'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login?callbackUrl=/orders');
      return;
    }
    
    fetchOrderDetails();
  }, [session, status, router, orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setOrderItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading while checking authentication
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    return null;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingAddress = JSON.parse(order.shipping_address);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-2xl sm:text-3xl font-bold text-black hover:text-gray-700 transition-colors"
              >
                Shop
              </Link>
              <span className="text-gray-400 text-xl">/</span>
              <Link
                href="/orders"
                className="text-xl font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Orders
              </Link>
              <span className="text-gray-400 text-xl">/</span>
              <h1 className="text-xl font-semibold text-gray-900">Order #{order.id}</h1>
            </div>
            <Link
              href="/products"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Continue Shopping
            </Link>
          </div>
          
          <Link
            href="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600 mt-2">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Price: ${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{shippingAddress.address}</p>
                    <p className="text-sm text-gray-600">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{shippingAddress.country}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{shippingAddress.email}</span>
                </div>
                
                {shippingAddress.phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{shippingAddress.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(parseFloat(order.total_amount) - 5.99 - (parseFloat(order.total_amount) * 0.08)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(parseFloat(order.total_amount) * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${order.status !== 'pending' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Processing</p>
                    <p className="text-xs text-gray-500">Order is being prepared</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipped</p>
                    <p className="text-xs text-gray-500">Order is on its way</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivered</p>
                    <p className="text-xs text-gray-500">Order received</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 