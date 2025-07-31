import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import pool from '../../../../../lib/db';

// GET order statistics
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

    // Get total orders and revenue
    const [totalResult] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
    `);

    // Get recent orders with customer info
    const [recentOrders] = await pool.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        u.name as customerName
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    return NextResponse.json({
      total: totalResult[0].total,
      revenue: totalResult[0].revenue,
      recent: recentOrders
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order statistics' },
      { status: 500 }
    );
  }
} 