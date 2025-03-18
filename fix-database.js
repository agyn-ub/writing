const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixDatabase() {
  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query('BEGIN');

    // Check if the column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'essays' AND column_name = 'essay_bank_id'
    `);

    if (checkResult.rows.length === 0) {
      console.log('Column essay_bank_id does not exist, creating it...');
      // Add the column if it doesn't exist
      await client.query(`
        ALTER TABLE "essays" 
        ADD COLUMN "essay_bank_id" INTEGER REFERENCES "essay_bank"("id")
      `);
      console.log('Column essay_bank_id created successfully');
    } else {
      console.log('Column essay_bank_id already exists');
    }

    // Commit the transaction
    await client.query('COMMIT');
    console.log('Database fix completed successfully');
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error fixing database:', error);
  } finally {
    client.release();
    pool.end();
  }
}

fixDatabase(); 