// Centralized product data
export const allProducts = [
  { id: "clock", src: "/images/clock.jpeg", name: "Clock", price: 29.99, details: "Modern wall clock for home or office.", brand: "TimeCraft", rating: 4.5, category: "Home", description: "Elegant wall clock with modern design, perfect for home or office decoration." },
  { id: "dining-table", src: "/images/dining table.jpg", name: "Dining Table", price: 199.99, details: "Elegant dining table for 6.", brand: "FurniturePro", rating: 4.8, category: "Home", description: "Beautiful dining table that seats 6 people comfortably. Made from high-quality wood with elegant finish." },
  { id: "sofa", src: "/images/sofa.jpg", name: "Sofa", price: 499.99, details: "Comfortable 3-seater sofa.", brand: "ComfortLux", rating: 4.7, category: "Home", description: "Premium 3-seater sofa with plush cushions and durable fabric. Perfect for living room comfort." },
  { id: "fan", src: "/images/fan.jpg", name: "Fan", price: 39.99, details: "High-speed ceiling fan.", brand: "CoolAir", rating: 4.3, category: "Electronics", description: "Energy-efficient ceiling fan with multiple speed settings and quiet operation. Ideal for keeping rooms cool and comfortable." },
  { id: "tshirt", src: "/images/tshirt.jpg", name: "T-shirt", price: 14.99, details: "Cotton t-shirt, various sizes.", brand: "StyleWear", rating: 4.2, category: "Fashion", description: "Comfortable cotton t-shirt available in multiple sizes and colors. Perfect for everyday wear with a classic fit." },
  { id: "kurta", src: "/images/kurta.jpg", name: "Kurti", price: 24.99, details: "Kurti for womens.", brand: "EthnicWear", rating: 4.6, category: "Fashion", description: "Elegant kurti for women with traditional design and modern comfort. Perfect for ethnic occasions." },
  { id: "pant", src: "/images/pant.jpg", name: "Pant", price: 34.99, details: "Slim-fit pants for all occasions.", brand: "StyleWear", rating: 4.4, category: "Fashion", description: "Versatile slim-fit pants suitable for both casual and formal occasions. Made from high-quality fabric with excellent durability." },
  { id: "shirt", src: "/images/shirt.png", name: "Shirt", price: 19.99, details: "Formal shirt, wrinkle-free.", brand: "OfficeWear", rating: 4.1, category: "Fashion", description: "Professional formal shirt with wrinkle-resistant fabric. Perfect for office wear and formal events." },
  { id: "shoes", src: "/images/shoes.jpg", name: "Shoes", price: 49.99, details: "Running shoes, lightweight.", brand: "SportFlex", rating: 4.9, category: "Fashion", description: "Lightweight running shoes with excellent cushioning and breathable mesh upper. Ideal for athletic activities." },
  { id: "backpack", src: "/images/backpack.jpg", name: "Backpack", price: 39.99, details: "Spacious backpack for travel.", brand: "TravelGear", rating: 4.5, category: "Fashion", description: "Durable backpack with multiple compartments and comfortable straps. Perfect for travel and daily use." },
  { id: "water-bottle", src: "/images/water bottle.jpg", name: "Water Bottle", price: 9.99, details: "Insulated water bottle.", brand: "HydratePro", rating: 4.0, category: "Essentials", description: "Insulated water bottle that keeps drinks cold for hours. Eco-friendly and perfect for on-the-go hydration." },
  { id: "laptop", src: "/images/laptop.jpg", name: "Laptop", price: 899.99, details: "Powerful laptop for work and play.", brand: "TechPro", rating: 4.8, category: "Electronics", description: "High-performance laptop with fast processor and ample storage. Perfect for work, gaming, and entertainment." },
  { id: "smartphone", src: "/images/smartphone.jpg", name: "Smartphone", price: 699.99, details: "Latest smartphone, 128GB.", brand: "MobileTech", rating: 4.7, category: "Electronics", description: "Latest smartphone with advanced features, 128GB storage, and high-quality camera. Stay connected with style." },
  { id: "headphones", src: "/images/headphones.jpg", name: "Headphones", price: 59.99, details: "Wireless headphones, noise-cancelling.", brand: "AudioMax", rating: 4.6, category: "Electronics", description: "Premium wireless headphones with active noise cancellation and long battery life. Immerse yourself in crystal-clear sound." },
];

// Helper function to get product by ID
export const getProductById = (id) => {
  return allProducts.find(product => product.id === id);
};

// Helper function to get product by slug
export const getProductBySlug = (slug) => {
  return allProducts.find(product => 
    product.name.toLowerCase().replace(/\s+/g, '-') === slug
  );
};

// Helper function to search products
export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.details.toLowerCase().includes(searchTerm)
  );
}; 