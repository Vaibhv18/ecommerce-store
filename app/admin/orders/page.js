'use client';

import { useState, useEffect } from 'react';
import { 
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setSelectedOrder(orderData);
        setShowOrderModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">Manage customer orders and track their status</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Processing"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Order"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'shipped')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Mark as Shipped"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Delivered"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details - {selectedOrder.order.id}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.order.status)}`}>
                      {selectedOrder.order.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedOrder.order.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedOrder.order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="text-sm text-gray-900">{selectedOrder.order.customerName || 'N/A'}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.order.shippingAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-900">
                        {JSON.parse(selectedOrder.order.shippingAddress).firstName} {JSON.parse(selectedOrder.order.shippingAddress).lastName}
                      </p>
                      <p className="text-sm text-gray-900">
                        {JSON.parse(selectedOrder.order.shippingAddress).address}
                      </p>
                      <p className="text-sm text-gray-900">
                        {JSON.parse(selectedOrder.order.shippingAddress).city}, {JSON.parse(selectedOrder.order.shippingAddress).state} {JSON.parse(selectedOrder.order.shippingAddress).zipCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm text-gray-900">{formatCurrency(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 