import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { essayBankSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (id) {
      // Fetch a specific essay by ID
      const idNumber = parseInt(id, 10);
      
      if (isNaN(idNumber)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      
      const essay = await db.query.essayBankSchema.findFirst({
        where: eq(essayBankSchema.id, idNumber),
      });

      if (!essay) {
        return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
      }

      return NextResponse.json(essay);
    } else if (type) {
      // Fetch essays by type
      // Validate that type is one of the allowed values
      if (!['ACADEMIC_TASK1', 'GENERAL_TASK1', 'TASK2'].includes(type)) {
        return NextResponse.json({ error: 'Invalid essay type' }, { status: 400 });
      }
      
      const essays = await db.query.essayBankSchema.findMany({
        where: eq(essayBankSchema.type, type as 'ACADEMIC_TASK1' | 'GENERAL_TASK1' | 'TASK2'),
      });

      return NextResponse.json(essays);
    } else {
      // Fetch all essays
      const essays = await db.query.essayBankSchema.findMany();
      return NextResponse.json(essays);
    }
  } catch (error) {
    console.error('Error fetching essays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch essays' },
      { status: 500 }
    );
  }
} 