import pool from '../../../../lib/db';

// GET single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const [rows] = await pool.query(
      `SELECT p.*, u.email as userEmail 
       FROM products p 
       LEFT JOIN users u ON p.userId = u.id 
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, description, price, image } = await request.json();

    const [result] = await pool.query(
      'UPDATE products SET title = ?, description = ?, price = ?, image = ? WHERE id = ?',
      [title, description, price, image, id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const [updatedProduct] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    return Response.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const [result] = await pool.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 