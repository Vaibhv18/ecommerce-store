"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Heart, User, ChevronDown, ChevronLeft, ChevronRight, Menu, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSession } from "next-auth/react";
import SearchBar from "@/components/SearchBar";
import SEOHead from '@/components/SEOHead';
import { generateWebsiteSchema, generateOrganizationSchema } from '@/lib/seo';
import { allProducts } from '@/lib/products';

export default function HomePage() {
  const { data: session } = useSession();
  const { totalItems = 0, addToCart } = useCart();
  const { totalItems: wishlistItems = 0, addToWishlist, isInWishlist } = useWishlist();
  


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredStart, setFeaturedStart] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);





  // Hero slider images
  const heroSlides = [
    {
      src: "/images/essentials.jpg",
      alt: "Essentials",
    },
    {
      src: "/images/electronics.jpeg",
      alt: "Electronics",
    },
    {
      src: "/images/fashion.jpeg",
      alt: "Fashion",
    },
    {
      src: "/images/home.jpg",
      alt: "Home",
    },
  ];

  // Hero slider state
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Featured products: pick 6 random products from centralized data
  useEffect(() => {
    // Shuffle and pick 6 products on mount
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    setFeaturedProducts(shuffled.slice(0, 6));
  }, []);

  // Handle window resize for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial mobile state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // Featured products carousel state - responsive
  const productsPerView = isMobile ? 1 : 3;
  const featuredEnd = featuredStart + productsPerView;
  const canGoLeft = featuredStart > 0;
  const canGoRight = featuredEnd < featuredProducts.length;
  
  const handleFeaturedLeft = () => {
    if (canGoLeft) {
      setFeaturedStart(Math.max(0, featuredStart - productsPerView));
    } else {
      // Loop to the end
      setFeaturedStart(Math.max(0, featuredProducts.length - productsPerView));
    }
  };
  
  const handleFeaturedRight = () => {
    if (canGoRight) {
      setFeaturedStart(featuredStart + productsPerView);
    } else {
      // Loop to the beginning
      setFeaturedStart(0);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  return (
    <>
      <SEOHead
        title="Premium Products - Quality Guaranteed"
        description="Discover premium products at LUXE Store. Shop electronics, fashion, home essentials with free shipping and easy returns. Quality guaranteed."
        keywords="premium products, electronics, fashion, home essentials, online shopping, free shipping"
        url="/"
        schema={[generateWebsiteSchema(), generateOrganizationSchema()]}
      />
      <div className="min-h-screen bg-white font-serif">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-50 to-gray-100 shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Shop
      </h1>
            </a>
            
            {/* Search Box */}
            <div className="flex-1 max-w-md hidden md:block">
              <SearchBar />
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <a href="/cart" className="relative p-2 text-gray-600 hover:text-black transition-colors duration-200">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                ) : null}
              </a>

              {/* Wishlist */}
              <a href="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200">
                <Heart className="w-6 h-6" />
                {wishlistItems > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems}
                  </span>
                ) : null}
              </a>

              {/* User Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors duration-200">
                  <User className="w-6 h-6" />
                  <span className="hidden sm:block text-sm font-medium">
                    {session?.user?.name || 'Sign In'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {session ? (
                    <>
                      <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
                        My Profile
                      </a>
                      <a href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Orders
                      </a>
                      {session.user.isAdmin === true && (
                        <a href="/admin" className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 border-t border-gray-100">
                          Admin Dashboard
                        </a>
                      )}
                      <a href="/api/auth/signout?callbackUrl=/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg">
                        Sign Out
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="/auth/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
                        Sign In
                      </a>
                      <a href="/auth/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg">
                        Sign Up
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Menu */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="px-4 space-y-4">
              <SearchBar />
              <div className="flex flex-col space-y-2">
                <a href="/cart" className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart {totalItems > 0 ? `(${totalItems})` : ''}</span>
                </a>
                <a href="/wishlist" className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Wishlist {wishlistItems > 0 ? `(${wishlistItems})` : ''}</span>
                </a>
                {session ? (
                  <>
                    <a href="/profile" className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </a>
                    <a href="/orders" className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors">
                      <span>My Orders</span>
                    </a>
                    {session.user.isAdmin === true && (
                      <a href="/admin" className="flex items-center gap-2 p-2 text-purple-600 hover:text-purple-700 transition-colors">
                        <span>Admin Dashboard</span>
                      </a>
                    )}
                    <a href="/api/auth/signout?callbackUrl=/" className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors">
                      <span>Sign Out</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/auth/login" className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors">
                      <span>Sign In</span>
                    </a>
                    <a href="/auth/register" className="flex items-center gap-2 p-2 text-gray-600 hover:text-black transition-colors">
                      <span>Sign Up</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center bg-gradient-to-br from-[#fef4e3] via-[#fef4e3] to-[#fef4e3] overflow-hidden">
        {/* Slider Images */}
        {heroSlides.map((slide, idx) => (
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === heroIndex ? 1 : 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
            style={{ zIndex: idx === heroIndex ? 1 : 0 }}
          />
        ))}
        {/* Overlay for darkening image for text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        {/* Centered Quote */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <blockquote className="text-white text-xl sm:text-2xl md:text-3xl font-semibold text-center drop-shadow-lg max-w-2xl mx-auto px-4">
            "Elevate your everyday with essentials, electronics, fashion, and home."
          </blockquote>
        </div>
        {/* Browse Products Button at Bottom */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center w-full">
          <a href="/products">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="backdrop-blur bg-white/20 border border-white text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-white/40 hover:text-black transition-all duration-200"
            >
              Browse Products
            </motion.button>
          </a>
        </div>
        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-3 h-3 rounded-full border border-white transition-colors duration-200 ${
                idx === heroIndex ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fef4e3] via-[#fef4e3] to-[#fef4e3]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Featured Products
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of premium products
            </p>
          </motion.div>

          {/* Featured Products Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={handleFeaturedLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-4 rounded-full bg-white shadow-xl hover:shadow-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            
            <button
              onClick={handleFeaturedRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-4 rounded-full bg-white shadow-xl hover:shadow-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>

            {/* Products Container */}
            <div className="flex gap-6 md:gap-8 lg:gap-10 justify-center overflow-hidden px-8">
              {featuredProducts.slice(featuredStart, featuredEnd).map((product, index) => (
                <motion.div 
                  key={product.src} 
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 md:p-8 w-full max-w-sm transform hover:-translate-y-4 transition-all duration-500 border border-gray-100 flex-shrink-0"
                  whileHover={{ y: -12, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Product Image */}
                  <div className="relative mb-6">
                    <a href={`/products/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`} className="block">
                      <img 
                        src={product.src} 
                        alt={product.name} 
                        className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300" 
                      />
                    </a>
                    {/* Wishlist Button Overlay */}
                    <motion.button 
                      onClick={() => handleAddToWishlist(product)}
                      className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                        isInWishlist(product.id) 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white shadow-md'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base line-clamp-2 flex-1">
                        {product.details}
                      </p>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl md:text-3xl font-bold text-black">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
                        </div>
                      </div>
                      
                      <motion.button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-black text-white py-3 md:py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-300 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000] text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Shop</h3>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Simple products for modern living. Quality, design, and functionality in every item.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
