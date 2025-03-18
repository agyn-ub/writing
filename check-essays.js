const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkEssays() {
  const client = await pool.connect();
  try {
    // Get all essays
    console.log('Checking essays in database...');
    const essaysResult = await client.query(`
      SELECT id, type, user_id, essay_bank_id, submitted_at
      FROM essays
      ORDER BY submitted_at DESC
      LIMIT 10
    `);
    
    console.log(`Found ${essaysResult.rows.length} essays:`);
    essaysResult.rows.forEach(essay => {
      console.log(`- ID: ${essay.id}, Type: ${essay.type}, User ID: ${essay.user_id}, Essay Bank ID: ${essay.essay_bank_id}, Submitted: ${essay.submitted_at}`);
    });
    
    // Try to insert a test essay
    console.log('\nTrying to insert a test essay...');
    try {
      await client.query('BEGIN');
      
      // Get a valid user ID
      const userResult = await client.query(`
        SELECT id FROM users LIMIT 1
      `);
      
      if (userResult.rows.length === 0) {
        console.log('No users found in the database');
        await client.query('ROLLBACK');
        return;
      }
      
      const userId = userResult.rows[0].id;
      console.log(`Using user ID: ${userId}`);
      
      const insertResult = await client.query(`
        INSERT INTO essays (
          id, content, type, user_id, submitted_at, created_at, updated_at
        ) VALUES (
          'test-' || now(), 
          'Test content from check-essays.js', 
          'TASK2', 
          $1, 
          now(), 
          now(), 
          now()
        )
        RETURNING id
      `, [userId]);
      
      console.log(`Test essay inserted successfully with ID: ${insertResult.rows[0].id}`);
      await client.query('ROLLBACK'); // Don't actually save the test data
    } catch (insertError) {
      console.error('Error during test insert:', insertError.message);
      await client.query('ROLLBACK');
    }
    
  } catch (error) {
    console.error('Error checking essays:', error);
  } finally {
    client.release();
    pool.end();
  }
}

checkEssays(); 