import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CustomSession } from '@/app/api/auth/[...nextauth]/route';
import { pool } from '@/db/pool';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise
    const resolvedParams = await Promise.resolve(context.params);
    const essayId = resolvedParams.id;
    
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to view essays' },
        { status: 401 }
      );
    }

    if (!essayId) {
      return NextResponse.json(
        { error: 'Essay ID is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    const client = await pool.connect();
    try {
      // First, check if the essay exists and belongs to the user
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
        return NextResponse.json(
          { error: 'You do not have permission to view this essay' },
          { status: 403 }
        );
      }
      
      // Remove user_id from the response for security
      delete essay.user_id;
      
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