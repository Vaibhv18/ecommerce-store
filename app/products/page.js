"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Filter, ChevronDown, Star, Heart, ShoppingCart } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import SEOHead from '@/components/SEOHead';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { allProducts } from '@/lib/products';



export default function ProductsPage() {
  const { addToCart, totalItems } = useCart();
  const { addToWishlist, totalItems: wishlistItems, isInWishlist } = useWishlist();
  const [products, setProducts] = useState(allProducts);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique brands and categories
  const brands = ["all", ...new Set(allProducts.map(product => product.brand))];
  const categories = ["all", ...new Set(allProducts.map(product => product.category))];

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "relevance":
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy, selectedBrand, selectedCategory, priceRange]);

  const clearFilters = () => {
    setSortBy("relevance");
    setSelectedBrand("all");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 1000 });
  };

  // Generate SEO data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' }
  ]);

  return (
    <>
      <SEOHead
        title="All Products - Shop Premium Items"
        description="Browse our complete collection of premium products. Electronics, fashion, home essentials and more. Free shipping on all orders."
        keywords="products, electronics, fashion, home, shopping, online store"
        url="/products"
        schema={breadcrumbSchema}
      />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-slate-100">
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
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>
            
            {/* Cart and Wishlist Icons */}
            <div className="flex items-center gap-4">
              <a href="/cart" className="relative p-2 text-gray-600 hover:text-black transition-colors duration-200">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              </a>
              <a href="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems}
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
              All Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of quality products for your lifestyle
            </p>
          </div>

          {/* Filters and Sort */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors lg:hidden"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {/* Sort Options */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  {filteredProducts.length} of {products.length} products
                </div>
              </div>

              {/* Filter Options */}
              <div className={`mt-6 pt-6 border-t border-gray-200 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Brand Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {brands.map(brand => (
                        <option key={brand} value={brand}>
                          {brand === "all" ? "All Brands" : brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((img, index) => (
              <motion.div 
                key={img.src} 
                className="flex flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl p-4 md:p-6 w-full max-w-sm mx-auto transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a href={`/products/${encodeURIComponent(img.name.toLowerCase().replace(/\s+/g, '-'))}`} className="w-full">
                  <img src={img.src} alt={img.name} className="w-full h-40 md:h-56 object-cover rounded-xl mb-4 md:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300" />
                </a>
                <div className="w-full mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(img.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs md:text-sm text-gray-600 ml-1">({img.rating})</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{img.brand}</p>
                </div>
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center line-clamp-2">{img.name}</h4>
                <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 text-center line-clamp-2">{img.details}</p>
                <div className="flex flex-col md:flex-row items-center justify-between w-full mt-auto gap-2">
                  <span className="text-xl md:text-2xl font-bold text-black">${img.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <motion.button 
                      onClick={() => handleAddToCart(img)}
                      className="bg-black text-white px-3 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 text-xs md:text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add to Cart
                    </motion.button>
                    <motion.button 
                      onClick={() => handleAddToWishlist(img)}
                      className={`p-2 md:p-3 rounded-lg transition-all duration-200 ${
                        isInWishlist(img.id) 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isInWishlist(img.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
      </main>
    </>
  );
} 