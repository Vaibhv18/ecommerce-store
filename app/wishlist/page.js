"use client";
import { motion } from "framer-motion";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Heart, ArrowLeft, ShoppingBag, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { items, totalItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-slate-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-50 to-gray-100 shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <a href="/" className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  Shop
                </h1>
              </a>
              {/* Back Button */}
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:block">Back</span>
              </button>
            </div>
          </div>
        </header>

        {/* Empty Wishlist */}
        <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-24 h-24 text-gray-400 mx-auto mb-8" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
              <p className="text-gray-600 mb-8 text-lg">
                Start adding items to your wishlist to save them for later.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/products')}
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Shopping
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleMoveAllToCart = () => {
    items.forEach(product => {
      addToCart(product);
    });
    clearWishlist();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-50 to-gray-100 shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Shop
              </h1>
            </a>
            {/* Back Button */}
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Wishlist Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
                  My Wishlist
                </h1>
                <p className="text-gray-600">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              
              {items.length > 0 && (
                <div className="flex gap-4 mt-4 md:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMoveAllToCart}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Move All to Cart
                  </motion.button>
                  <button
                    onClick={clearWishlist}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {items.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="flex flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 w-full max-w-sm mx-auto transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a href={`/products/${encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-'))}`} className="w-full">
                    <img src={item.src} alt={item.name} className="w-full h-56 object-cover rounded-xl mb-6 shadow-md hover:shadow-lg transition-shadow duration-300" />
                  </a>
                  
                  <div className="w-full mb-2">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(item.rating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </div>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({item.rating || 4.5})</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{item.brand}</p>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 text-center line-clamp-2">{item.name}</h4>
                  <p className="text-gray-500 text-sm mb-4 text-center line-clamp-2">{item.details}</p>
                  
                  <div className="flex items-center justify-between w-full mt-auto">
                    <span className="text-2xl font-bold text-black">${item.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <motion.button 
                        onClick={() => handleMoveToCart(item)}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 