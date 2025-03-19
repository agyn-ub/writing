import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, CustomSession } from '@/app/api/auth/auth-options';
import { pool } from '@/db/pool';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to view your essays' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type') || null;

    // Connect to the database
    const client = await pool.connect();
    try {
      // Build the query based on parameters
      let query = `
        SELECT 
          e.id, 
          e.content, 
          e.type, 
          e.submitted_at, 
          e.essay_bank_id,
          eb.title as essay_title,
          eb.prompt as essay_prompt
        FROM 
          essays e
        LEFT JOIN 
          essay_bank eb ON e.essay_bank_id = eb.id
        WHERE 
          e.user_id = $1
      `;
      
      const queryParams = [session.user.id];
      let paramIndex = 2;
      
      // Add type filter if provided
      if (type) {
        query += ` AND e.type = $${paramIndex}`;
        queryParams.push(type);
        paramIndex++;
      }
      
      // Add ordering and pagination
      query += `
        ORDER BY e.submitted_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      queryParams.push(limit.toString(), offset.toString());
      
      // Execute the query
      const result = await client.query(query, queryParams);
      
      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) FROM essays 
        WHERE user_id = $1 ${type ? 'AND type = $2' : ''}
      `;
      const countParams = [session.user.id];
      if (type) countParams.push(type);
      
      const countResult = await client.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);
      
      return NextResponse.json({
        essays: result.rows,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching user essays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch essays' },
      { status: 500 }
    );
  }
} 