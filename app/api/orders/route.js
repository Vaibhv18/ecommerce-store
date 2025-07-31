import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import pool from '../../../lib/db';

// GET all orders (for order history)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user ID from session
    const [userResult] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [session.user.email]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userResult[0].id;

    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.status,
        o.total_amount,
        o.shipping_address,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { items, shipping, totals } = await request.json();

    // Get user ID from session
    const [userResult] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [session.user.email]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userResult[0].id;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order with user_id
    await pool.query(`
      INSERT INTO orders (id, user_id, status, total_amount, shipping_address, payment_status)
      VALUES (?, ?, 'pending', ?, ?, 'pending')
    `, [
      orderId,
      userId,
      totals.total,
      JSON.stringify(shipping)
    ]);

    // Create order items
    for (const item of items) {
      await pool.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [
        orderId,
        item.id,
        item.quantity,
        item.price
      ]);
    }

    return NextResponse.json({ 
      orderId,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 