# Ecommerce Store

A modern, responsive ecommerce website built with Next.js, MySQL, and Tailwind CSS.

## Features

- 🛍️ Product catalog with search and filtering
- 👤 User authentication and registration
- 🛒 Shopping cart functionality
- 👨‍💼 Admin panel for product management
- 📱 Fully responsive design
- 🔐 Secure authentication with NextAuth.js
- 🗄️ MySQL database with proper relationships

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MySQL
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS

## Prerequisites

- Node.js 18+ 
- MySQL Server
- npm or yarn

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ecommerce-store
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MySQL Database

Make sure MySQL is running on your system. You can use:
- MySQL Server (local installation)
- XAMPP
- Docker MySQL container

### 4. Create Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root         # or 'ecom_user' if you created a new user
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_store
DB_PORT=3306

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### 5. Set up the Database

Run the setup script to create tables and sample data:

```bash
node setup.js
```

This will:
- Create the `ecommerce_store` database
- Create all necessary tables (users, products, orders, order_items)
- Insert sample products
- Create an admin user (admin@example.com / admin123)

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users Table
- `id` - Unique identifier (UUID)
- `email` - User email (unique)
- `password` - Hashed password
- `isAdmin` - Admin flag
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Products Table
- `id` - Unique identifier (UUID)
- `title` - Product name
- `description` - Product description
- `price` - Product price
- `image` - Product image URL
- `userId` - Creator's user ID (foreign key)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Orders Table
- `id` - Unique identifier (UUID)
- `userId` - Customer's user ID (foreign key)
- `total` - Order total amount
- `status` - Order status (pending, processing, shipped, delivered, cancelled)
- `createdAt` - Order creation timestamp
- `updatedAt` - Last update timestamp

### Order Items Table
- `id` - Unique identifier (UUID)
- `orderId` - Order ID (foreign key)
- `productId` - Product ID (foreign key)
- `quantity` - Item quantity
- `price` - Item price at time of purchase

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Register new user

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

## Default Admin Account

After running the setup script, you can log in with:
- **Email:** admin@example.com
- **Password:** admin123

## Project Structure

```
ecommerce-store/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin panel
│   ├── products/          # Product pages
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # React components
├── lib/                   # Utility functions
│   └── db.js             # Database connection
├── database/              # Database files
│   └── schema.sql        # SQL schema
├── public/               # Static assets
├── styles/               # CSS files
├── setup.js              # Database setup script
└── package.json          # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
