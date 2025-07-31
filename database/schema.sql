-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_store;
USE ecommerce_store;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(500),
  userId VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT,
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255),
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (id, email, password, isAdmin) VALUES 
('admin-123', 'admin@example.com', '$2a$10$hashedpassword', TRUE);

INSERT INTO products (id, title, description, price, image, userId) VALUES 
('prod-1', 'Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, '/images/headphones.jpg', 'admin-123'),
('prod-2', 'Smartphone', 'Latest smartphone with advanced features', 699.99, '/images/smartphone.jpg', 'admin-123'),
('prod-3', 'Laptop', 'Powerful laptop for work and gaming', 1299.99, '/images/laptop.jpg', 'admin-123'); 