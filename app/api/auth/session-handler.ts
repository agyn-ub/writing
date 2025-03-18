import { pool } from '@/db/pool';

/**
 * Handles user authentication and ensures consistent user IDs
 * across sessions, even if the OAuth provider changes the ID.
 */
export async function handleUserSession(user: any) {
  if (!user?.id || !user?.email) {
    console.error('Invalid user data for session handling');
    return null;
  }

  console.log('Handling user session:', {
    id: user.id,
    email: user.email,
    name: user.name || 'Unknown'
  });

  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Check if user exists by email (most stable identifier)
    const existingUserResult = await client.query(`
      SELECT id, email, name FROM users WHERE email = $1
    `, [user.email]);
    
    // If user exists but has a different ID, update the ID
    if (existingUserResult.rows.length > 0) {
      const existingUser = existingUserResult.rows[0];
      
      if (existingUser.id !== user.id) {
        console.log(`ID mismatch detected for ${user.email}`);
        console.log(`Current ID in DB: ${existingUser.id}`);
        console.log(`New ID from auth provider: ${user.id}`);
        
        // Update any essays with the old user ID
        const essaysResult = await client.query(`
          SELECT COUNT(*) FROM essays WHERE user_id = $1
        `, [existingUser.id]);
        
        const essayCount = parseInt(essaysResult.rows[0].count);
        if (essayCount > 0) {
          console.log(`Found ${essayCount} essays with the old user ID. Updating...`);
          
          // Temporarily disable the foreign key constraint
          await client.query(`ALTER TABLE essays DISABLE TRIGGER ALL;`);
          
          // Update the essays
          await client.query(`
            UPDATE essays SET user_id = $1 WHERE user_id = $2
          `, [user.id, existingUser.id]);
          
          // Re-enable the foreign key constraint
          await client.query(`ALTER TABLE essays ENABLE TRIGGER ALL;`);
          
          console.log(`Updated ${essayCount} essays with the new user ID`);
        }
        
        // Update the user ID
        await client.query(`
          UPDATE users SET id = $1 WHERE id = $2
        `, [user.id, existingUser.id]);
        
        console.log(`User ID updated from ${existingUser.id} to ${user.id}`);
      } else {
        console.log(`User ID ${user.id} already matches in database`);
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      return user;
    } 
    // If user doesn't exist, create a new user
    else {
      console.log(`Creating new user with ID ${user.id} and email ${user.email}`);
      
      // Insert the new user
      await client.query(`
        INSERT INTO users (id, email, name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        user.id,
        user.email,
        user.name || null,
        new Date(),
        new Date()
      ]);
      
      // Commit the transaction
      await client.query('COMMIT');
      console.log(`New user created with ID ${user.id}`);
      return user;
    }
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error('Error handling user session:', error);
    return null;
  } finally {
    // Release the client back to the pool
    client.release();
  }
} 