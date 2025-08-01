'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We&apos;ve received your order and will process it shortly.
            </p>
          </div>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Details</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Order ID:</span> {orderId}
              </p>
              <p className="text-sm text-gray-600">
                You&apos;ll receive an email confirmation shortly.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We&apos;ll process your order within 24 hours</li>
                <li>• You&apos;ll receive shipping updates via email</li>
                <li>• Your order will be shipped within 2-3 business days</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/orders"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-medium text-center"
              >
                View Order History
              </Link>
              <Link
                href="/products"
                className="flex-1 bg-gray-200 text-gray-900 py-3 px-6 rounded-md hover:bg-gray-300 font-medium text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 