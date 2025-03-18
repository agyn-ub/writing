import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v4 as uuidv4 } from 'uuid';
import { CustomSession } from '@/app/api/auth/[...nextauth]/route';
import { pool } from '@/db/pool';
import { handleUserSession } from '../auth/session-handler';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit an essay' },
        { status: 401 }
      );
    }

    console.log('Session user:', {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email
    });

    // Ensure user ID is consistent in the database
    const verifiedUser = await handleUserSession(session.user);
    if (!verifiedUser) {
      return NextResponse.json(
        { error: 'Failed to verify user session' },
        { status: 400 }
      );
    }

    const { content, type, essayBankId } = await request.json();

    if (!content || !type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      );
    }

    // Validate essay type
    if (!['ACADEMIC_TASK1', 'GENERAL_TASK1', 'TASK2'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid essay type' },
        { status: 400 }
      );
    }

    // Generate a unique ID for the essay
    const essayId = uuidv4();
    
    console.log('Submitting essay with data:', {
      id: essayId,
      contentLength: content.length,
      type,
      userId: verifiedUser.id, // Use the verified user ID
      essayBankId: essayBankId || null
    });

    // Use a direct database connection to insert the essay
    const client = await pool.connect();
    try {
      // First, verify the user exists in the database
      console.log(`Verifying user with ID: ${verifiedUser.id}`);
      const userCheck = await client.query(`
        SELECT id, name, email FROM users WHERE id = $1
      `, [verifiedUser.id]);
      
      if (userCheck.rows.length === 0) {
        console.error(`User with ID ${verifiedUser.id} not found in database`);
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 400 }
        );
      }
      
      const user = userCheck.rows[0];
      console.log(`User verified in database: ID=${user.id}, Name=${user.name}, Email=${user.email}`);
      
      // Insert the essay
      console.log(`Inserting essay with ID: ${essayId}`);
      const result = await client.query(`
        INSERT INTO essays (
          id, content, type, user_id, essay_bank_id, submitted_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        )
        RETURNING *
      `, [
        essayId,
        content,
        type,
        verifiedUser.id, // Use the verified user ID
        essayBankId || null,
        new Date(),
        new Date(),
        new Date()
      ]);

      console.log(`Essay inserted successfully with ID: ${essayId}`);
      const newEssay = result.rows[0];
      return NextResponse.json(newEssay, { status: 201 });
    } catch (error) {
      console.error('Database error during essay submission:', error);
      throw error; // Re-throw to be caught by the outer try/catch
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error submitting essay:', error);
    return NextResponse.json(
      { error: 'Failed to submit essay' },
      { status: 500 }
    );
  }
} 