const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkUser() {
  const client = await pool.connect();
  try {
    // Get all users
    console.log('Checking users in database...');
    const usersResult = await client.query(`
      SELECT id, email, name
      FROM users
      LIMIT 10
    `);
    
    console.log(`Found ${usersResult.rows.length} users:`);
    usersResult.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });
    
    // Check if a specific user exists
    const userId = process.argv[2]; // Get user ID from command line argument
    if (userId) {
      console.log(`\nChecking for user with ID: ${userId}`);
      const userCheck = await client.query(`
        SELECT id, email, name
        FROM users
        WHERE id = $1
      `, [userId]);
      
      if (userCheck.rows.length > 0) {
        const user = userCheck.rows[0];
        console.log(`User found: ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
      } else {
        console.log(`No user found with ID: ${userId}`);
      }
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    client.release();
    pool.end();
  }
}

checkUser(); 