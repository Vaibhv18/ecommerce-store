import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

// GET all users (admin only)
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, isAdmin, createdAt FROM users ORDER BY createdAt DESC'
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

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const [newUser] = await pool.query(
      'SELECT id, email, isAdmin, createdAt FROM users WHERE id = ?',
      [result.insertId]
    );

    return Response.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 