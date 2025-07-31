const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server with database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: 'ecommerce_store'
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS ecommerce_store');
    console.log('Database created or already exists');

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');

    // Create products table
    await connection.execute(`
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
      )
    `);
    console.log('Products table created');

    // Create orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id INT,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        shipping_address TEXT,
        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Orders table created');

    // Create order_items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(255),
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log('Order items table created');

    // Check if admin user exists
    const [adminUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@example.com']
    );

    if (adminUsers.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await connection.execute(
        'INSERT INTO users (id, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        ['admin-123', 'admin@example.com', hashedPassword, true]
      );
      console.log('Admin user created: admin@example.com / admin123');
    }

    // Check if sample products exist
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    
    if (products[0].count === 0) {
      // Insert sample products
      const sampleProducts = [
        ['prod-1', 'Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, '/images/headphones.jpg', 'admin-123'],
        ['prod-2', 'Smartphone', 'Latest smartphone with advanced features', 699.99, '/images/smartphone.jpg', 'admin-123'],
        ['prod-3', 'Laptop', 'Powerful laptop for work and gaming', 1299.99, '/images/laptop.jpg', 'admin-123']
      ];

      for (const product of sampleProducts) {
        await connection.execute(
          'INSERT INTO products (id, title, description, price, image, userId) VALUES (?, ?, ?, ?, ?, ?)',
          product
        );
      }
      console.log('Sample products created');
    }

    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run setup
setupDatabase(); 