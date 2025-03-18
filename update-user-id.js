const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateUserId() {
  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query('BEGIN');

    // Get the current user
    const currentUserResult = await client.query(`
      SELECT id, email, name
      FROM users
      LIMIT 1
    `);
    
    if (currentUserResult.rows.length === 0) {
      console.log('No users found in the database');
      await client.query('ROLLBACK');
      return;
    }
    
    const currentUser = currentUserResult.rows[0];
    console.log('Current user:', currentUser);
    
    // The new user ID from the session
    const newUserId = '109007329430005245080';
    
    // Check if the new user ID already exists
    const checkNewIdResult = await client.query(`
      SELECT id FROM users WHERE id = $1
    `, [newUserId]);
    
    if (checkNewIdResult.rows.length > 0) {
      console.log(`User with ID ${newUserId} already exists`);
      await client.query('ROLLBACK');
      return;
    }
    
    // Update the user ID
    console.log(`Updating user ID from ${currentUser.id} to ${newUserId}`);
    
    // First, update any foreign key references
    // Check if there are any essays with the old user ID
    const essaysResult = await client.query(`
      SELECT COUNT(*) FROM essays WHERE user_id = $1
    `, [currentUser.id]);
    
    const essayCount = parseInt(essaysResult.rows[0].count);
    if (essayCount > 0) {
      console.log(`Found ${essayCount} essays with the old user ID. Updating...`);
      
      // Temporarily disable the foreign key constraint
      await client.query(`
        ALTER TABLE essays DISABLE TRIGGER ALL;
      `);
      
      // Update the essays
      await client.query(`
        UPDATE essays SET user_id = $1 WHERE user_id = $2
      `, [newUserId, currentUser.id]);
      
      console.log(`Updated ${essayCount} essays with the new user ID`);
      
      // Re-enable the foreign key constraint
      await client.query(`
        ALTER TABLE essays ENABLE TRIGGER ALL;
      `);
    }
    
    // Now update the user ID
    await client.query(`
      UPDATE users SET id = $1 WHERE id = $2
    `, [newUserId, currentUser.id]);
    
    console.log(`User ID updated successfully`);
    
    // Verify the update
    const verifyResult = await client.query(`
      SELECT id, email, name FROM users WHERE id = $1
    `, [newUserId]);
    
    if (verifyResult.rows.length > 0) {
      console.log('Updated user:', verifyResult.rows[0]);
      
      // Commit the transaction
      await client.query('COMMIT');
      console.log('Transaction committed successfully');
    } else {
      console.log('Failed to update user ID');
      await client.query('ROLLBACK');
    }
  } catch (error) {
    console.error('Error updating user ID:', error);
    await client.query('ROLLBACK');
  } finally {
    client.release();
    pool.end();
  }
}

updateUserId(); 