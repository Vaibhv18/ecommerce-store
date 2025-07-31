import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import pool from '../../../../lib/db';

// GET specific order with items
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;

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

    // Get order details (only for the authenticated user)
    const [orderResult] = await pool.query(`
      SELECT * FROM orders WHERE id = ? AND user_id = ?
    `, [id, userId]);

    if (orderResult.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    // Get order items with product details
    const [itemsResult] = await pool.query(`
      SELECT 
        oi.id,
        oi.quantity,
        oi.price,
        p.name,
        p.image,
        p.description
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    return NextResponse.json({
      order,
      items: itemsResult
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 