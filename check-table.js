const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkTable() {
  const client = await pool.connect();
  try {
    // Get table structure
    console.log('Checking essays table structure...');
    const tableResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'essays'
      ORDER BY ordinal_position
    `);
    
    console.log('Essays table structure:');
    tableResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });
    
    // Try a simple insert
    console.log('\nTrying a test insert...');
    try {
      await client.query('BEGIN');
      const insertResult = await client.query(`
        INSERT INTO essays (
          id, content, type, user_id, submitted_at, created_at, updated_at
        ) VALUES (
          'test-' || now(), 
          'Test content', 
          'TASK2', 
          (SELECT id FROM users LIMIT 1), 
          now(), 
          now(), 
          now()
        )
        RETURNING id
      `);
      console.log(`Test insert successful with ID: ${insertResult.rows[0].id}`);
      await client.query('ROLLBACK'); // Don't actually save the test data
    } catch (insertError) {
      console.error('Error during test insert:', insertError.message);
      await client.query('ROLLBACK');
    }
    
  } catch (error) {
    console.error('Error checking table:', error);
  } finally {
    client.release();
    pool.end();
  }
}

checkTable(); 