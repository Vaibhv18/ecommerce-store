"use client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleWishlist = () => {
    addToWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 font-serif"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.title}
          className="w-full h-96 object-cover transition-transform duration-500"
          whileHover={{ scale: 1.05 }}
          loading="lazy"
        />
        
        {/* Overlay with actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`p-3 rounded-full shadow-lg transition-colors ${
              isInWishlist(product.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </motion.button>
        </motion.div>

        {/* Logo Watermark */}
        <div className="absolute bottom-4 left-4 w-8 h-8 border border-black bg-white flex items-center justify-center">
          <span className="text-black font-bold text-sm">N</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-black mb-3 line-clamp-2 leading-tight">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-base mb-6 line-clamp-2 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-black">
            ${Number(product.price).toFixed(2)}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
