'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, EnvelopeIcon, CalendarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login?callbackUrl=/profile');
      return;
    }
    
    fetchUserProfile();
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              {user && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">My Orders</p>
                    <p className="text-sm text-gray-500">View order history</p>
                  </div>
                </Link>
                
                <Link
                  href="/products"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBagIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Continue Shopping</p>
                    <p className="text-sm text-gray-500">Browse products</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Status</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {user?.isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 