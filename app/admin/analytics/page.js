'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats/orders'),
        fetch('/api/admin/stats/products'),
        fetch('/api/admin/stats/users')
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const usersData = await usersRes.json();

      setAnalytics({
        totalRevenue: ordersData.revenue || 0,
        totalOrders: ordersData.total || 0,
        totalProducts: productsData.total || 0,
        totalUsers: usersData.total || 0,
        recentOrders: ordersData.recent || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed insights and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                             <div className="flex items-center mt-1">
                 <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                 <span className="text-sm text-green-600 ml-1">+12%</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                             <div className="flex items-center mt-1">
                 <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                 <span className="text-sm text-green-600 ml-1">+8%</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                             <div className="flex items-center mt-1">
                 <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                 <span className="text-sm text-green-600 ml-1">+15%</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CubeIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
                             <div className="flex items-center mt-1">
                 <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                 <span className="text-sm text-green-600 ml-1">+5%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
                             <ArrowTrendingUpIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">Revenue chart will be implemented here</p>
              <p className="text-sm text-gray-500">Using Chart.js or similar library</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Overview</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ShoppingBagIcon className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Orders chart will be implemented here</p>
              <p className="text-sm text-gray-500">Using Chart.js or similar library</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {analytics.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id} placed
                      </p>
                      <p className="text-sm text-gray-500">
                        by {order.customerName || 'Unknown'} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 