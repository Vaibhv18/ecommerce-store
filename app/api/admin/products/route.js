import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import pool from '../../../../lib/db';

// GET all products (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const [products] = await pool.query(`
      SELECT * FROM products ORDER BY id DESC
    `);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product (admin)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { name, description, price, image, category, brand, stock } = await request.json();

    if (!name || !description || !price || !image || !category || !brand || !stock) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(`
      INSERT INTO products (name, description, price, image, category, brand, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, description, price, image, category, brand, stock]);

    const [newProduct] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 