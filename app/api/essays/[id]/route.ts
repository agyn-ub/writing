import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, CustomSession } from '@/app/api/auth/auth-options';
import { pool } from '@/db/pool';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: essayId } = await params;
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to view essays' },
        { status: 401 }
      );
    }
    
    // Fetch the essay data from the database
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          e.id, 
          e.content, 
          e.type, 
          e.user_id,
          e.submitted_at, 
          e.essay_bank_id,
          eb.title as essay_title,
          eb.prompt as essay_prompt
        FROM 
          essays e
        LEFT JOIN 
          essay_bank eb ON e.essay_bank_id = eb.id
        WHERE 
          e.id = $1
      `;
      
      const result = await client.query(query, [essayId]);
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Essay not found' },
          { status: 404 }
        );
      }
      
      const essay = result.rows[0];
      
      // Check if the essay belongs to the current user
      if (essay.user_id !== session.user.id) {
        // If not authorized, return 403
        return NextResponse.json(
          { error: 'You do not have permission to view this essay' },
          { status: 403 }
        );
      }

      return NextResponse.json(essay);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching essay:', error);
    return NextResponse.json(
      { error: 'Failed to fetch essay' },
      { status: 500 }
    );
  }
} 