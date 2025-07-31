"use client";
import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { allProducts } from '@/lib/products';



export default function SearchBar({ className = "", onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Generate search suggestions
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.details.toLowerCase().includes(searchTerm)
    );

    // Extract unique words from results
    const words = new Set();
    results.forEach(product => {
      words.add(product.name.toLowerCase());
      words.add(product.brand.toLowerCase());
      words.add(product.category.toLowerCase());
    });

    // Filter words that match the search term
    const matchingWords = Array.from(words).filter(word => 
      word.includes(searchTerm) && word !== searchTerm
    );

    // Limit suggestions to 5 items
    setSuggestions(matchingWords.slice(0, 5));
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      // Add to recent searches
      const newSearch = query.trim();
      if (!recentSearches.includes(newSearch)) {
        setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
      }
      
      // Navigate to search results
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setShowSuggestions(false);
  };

  const removeRecentSearch = (searchTerm, e) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(search => search !== searchTerm));
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-1 rounded-md hover:bg-gray-800 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (query.trim() || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && !query.trim() && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between group">
                      <button
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex-1 text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        {search}
                      </button>
                      <button
                        onClick={(e) => removeRecentSearch(search, e)}
                        className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {query.trim() && suggestions.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h3>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        index === selectedIndex 
                          ? 'bg-gray-100 text-black' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query.trim() && suggestions.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No suggestions found for "{query}"</p>
                <button
                  onClick={handleSearch}
                  className="mt-2 text-sm text-black hover:underline"
                >
                  Search anyway
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 