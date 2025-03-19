import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleUserSession } from '../auth/session-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'You must be signed in to submit an essay' }, { status: 401 });
    }
    
    // Ensure user ID is consistent in the database
    const verifiedUser = await handleUserSession(session.user);
    if (!verifiedUser) {
      return NextResponse.json({ error: 'Failed to verify user session' }, { status: 400 });
    }
    
    // Parse the request body
    const { content, type, essayBankId } = await request.json();
    
    // Validate the request body
    if (!content) {
      return NextResponse.json({ error: 'Essay content is required' }, { status: 400 });
    }
    
    if (!type || !['ACADEMIC_TASK1', 'GENERAL_TASK1', 'TASK2'].includes(type)) {
      return NextResponse.json({ error: 'Valid essay type is required' }, { status: 400 });
    }
    
    // Connect to the database
    const client = await pool.connect();
    
    try {
      // Check if the user has already submitted an essay of this type today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const existingEssayCheck = await client.query(`
        SELECT id FROM essays 
        WHERE user_id = $1 
        AND type = $2 
        AND submitted_at >= $3 
        AND submitted_at <= $4
      `, [verifiedUser.id, type, startOfDay, endOfDay]);
      
      if (existingEssayCheck.rows.length > 0) {
        return NextResponse.json(
          { 
            error: 'Daily limit reached',
            message: `You have already submitted a ${type.replace('_', ' ')} essay today. You can submit one essay of each type per day.`
          }, 
          { status: 429 }
        );
      }
      
      // Insert the essay into the database
      const result = await client.query(`
        INSERT INTO essays (user_id, content, type, essay_bank_id, submitted_at) 
        VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING id, submitted_at
      `, [verifiedUser.id, content, type, essayBankId || null]);
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Failed to save essay' }, { status: 500 });
      }
      
      const savedEssay = result.rows[0];
      
      return NextResponse.json({
        id: savedEssay.id,
        message: 'Essay submitted successfully',
        submittedAt: savedEssay.submitted_at
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error submitting essay:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 