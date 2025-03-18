import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CustomSession } from '@/app/api/auth/[...nextauth]/route';
import { pool } from '@/db/pool';

interface Essay {
  id: string;
  content: string;
  type: string;
  submitted_at: string;
  essay_bank_id: number | null;
  essay_title: string | null;
  essay_prompt: string | null;
  user_id: string;
}

// Helper function to get essay type display name
const getEssayTypeDisplay = (type: string) => {
  switch (type) {
    case 'ACADEMIC_TASK1':
      return 'Academic Task 1';
    case 'GENERAL_TASK1':
      return 'General Task 1';
    case 'TASK2':
      return 'Task 2';
    default:
      return type;
  }
};

// Helper function to get essay type color
const getEssayTypeColor = (type: string) => {
  switch (type) {
    case 'ACADEMIC_TASK1':
      return 'bg-blue-600';
    case 'GENERAL_TASK1':
      return 'bg-green-600';
    case 'TASK2':
      return 'bg-purple-600';
    default:
      return 'bg-gray-600';
  }
};

export default async function EssayPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Await params if it's a Promise
  const resolvedParams = await Promise.resolve(params);
  const essayId = resolvedParams.id;
  
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user) {
    redirect('/login');
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
      notFound();
    }
    
    const essay = result.rows[0] as Essay;
    
    // Check if the essay belongs to the current user
    if (essay.user_id !== session.user.id) {
      // If not authorized, redirect to dashboard
      redirect('/dashboard');
    }

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`${getEssayTypeColor(essay.type)} text-white py-3 px-4`}>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{essay.essay_title || 'Untitled Essay'}</h1>
              <span className="text-sm bg-white bg-opacity-20 rounded-full px-3 py-1">
                {getEssayTypeDisplay(essay.type)}
              </span>
            </div>
            <p className="text-sm opacity-80">
              Submitted on {format(new Date(essay.submitted_at), 'MMMM d, yyyy')}
            </p>
          </div>

          {essay.essay_prompt && (
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Essay Prompt:</h2>
              <p className="text-gray-700">{essay.essay_prompt}</p>
            </div>
          )}

          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Response:</h2>
            <div className="prose max-w-none">
              {essay.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {essay.essay_bank_id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <Link
                href={`/write?essayBankId=${essay.essay_bank_id}`}
                className="inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try This Essay Again
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching essay:', error);
    throw error;
  } finally {
    client.release();
  }
} 