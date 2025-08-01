import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

// GET all users (admin only)
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, isAdmin, created_at FROM users ORDER BY created_at DESC'
    );
    
    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST new user (register)
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return Response.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with UUID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const [result] = await pool.query(
      'INSERT INTO users (id, name, email, password, isAdmin) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, false]
    );

    const [newUser] = await pool.query(
      'SELECT id, name, email, isAdmin, created_at FROM users WHERE id = ?',
      [userId]
    );

    return Response.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 