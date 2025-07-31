"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SEOHead from '@/components/SEOHead';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { getProductBySlug } from '@/lib/products';



export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { slug } = params;
  
  // Convert slug back to product name
  const productName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const product = getProductBySlug(slug);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button 
            onClick={() => router.back()}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Generate SEO data
  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.name, url: `/products/${slug}` }
  ]);

  return (
    <>
      <SEOHead
        title={`${product.name} - ${product.details}`}
        description={product.description}
        keywords={`${product.name}, ${product.details}, online shopping, LUXE Store`}
        image={product.src}
        url={`/products/${slug}`}
        type="product"
        schema={[productSchema, breadcrumbSchema]}
      />
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

      {/* Product Detail Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Product Image */}
            <div className="flex justify-center lg:justify-start">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={product.src} 
                  alt={product.name} 
                  className="w-full max-w-md h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(4.8/5) • 127 reviews</span>
                </div>

                <div className="text-3xl font-bold text-black mb-6">
                  ${product.price.toFixed(2)}
                </div>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToWishlist}
                      className={`p-4 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors ${
                        isInWishlist(product.id) ? 'text-red-500 border-red-300 bg-red-50' : ''
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-black mb-2">Product Features:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        High-quality materials
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Durable construction
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Free shipping
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        30-day return policy
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      </main>
    </>
  );
} 