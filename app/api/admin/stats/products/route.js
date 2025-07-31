import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import pool from '../../../../../lib/db';

// GET product statistics
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

    // Get total products
    const [totalResult] = await pool.query(`
      SELECT COUNT(*) as total FROM products
    `);

    return NextResponse.json({
      total: totalResult[0].total
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product statistics' },
      { status: 500 }
    );
  }
} 