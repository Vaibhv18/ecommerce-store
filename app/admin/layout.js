'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login?callbackUrl=/admin');
      return;
    }
    
    if (!session.user.isAdmin) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user.isAdmin) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: CubeIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin Panel
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session.user.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{session.user.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                Back to Store
              </Link>
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
} 