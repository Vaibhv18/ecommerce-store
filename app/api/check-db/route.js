import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    // Check if tables exist and their structure
    const [tables] = await pool.query('SHOW TABLES');
    
    let tableInfo = {};
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      tableInfo[tableName] = columns;
    }
    
    return NextResponse.json({
      success: true,
      tables: tableInfo,
      tableNames: tables.map(t => Object.values(t)[0])
    });
  } catch (error) {
    console.error('Database check error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
} 