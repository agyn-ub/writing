import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CustomSession } from '@/app/api/auth/[...nextauth]/route';
import { pool } from '@/db/pool';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to check essay limits' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Calculate today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const client = await pool.connect();
    try {
      // Query essays submitted today by this user
      const result = await client.query(`
        SELECT DISTINCT type 
        FROM essays 
        WHERE user_id = $1 
        AND submitted_at >= $2 
        AND submitted_at <= $3
      `, [userId, startOfDay, endOfDay]);
      
      // Create a map of submitted essay types
      const submittedTypes = result.rows.map(row => row.type);
      
      const submittedToday = {
        ACADEMIC_TASK1: submittedTypes.includes('ACADEMIC_TASK1'),
        GENERAL_TASK1: submittedTypes.includes('GENERAL_TASK1'),
        TASK2: submittedTypes.includes('TASK2')
      };
      
      return NextResponse.json({ submittedToday });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error checking essay daily status:', error);
    return NextResponse.json(
      { error: 'Failed to check essay status' },
      { status: 500 }
    );
  }
} 