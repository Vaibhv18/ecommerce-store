'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link 
        href="/" 
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <HomeIcon className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.name}</span>
          ) : (
            <Link 
              href={item.url}
              className="hover:text-gray-700 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
} 