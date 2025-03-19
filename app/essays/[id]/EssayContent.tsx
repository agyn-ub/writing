'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/app/contexts/LanguageContext';

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
const getEssayTypeDisplay = (type: string, t: (key: string) => string) => {
  switch (type) {
    case 'ACADEMIC_TASK1':
      return t('essays.academic');
    case 'GENERAL_TASK1':
      return t('essays.general');
    case 'TASK2':
      return t('essays.task2');
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

export default function EssayContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'loading') {
      return;
    }
    
    async function fetchEssay() {
      try {
        const response = await fetch(`/api/essays/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          } else if (response.status === 403) {
            router.push('/dashboard');
          }
          return;
        }
        
        const data = await response.json();
        setEssay(data);
      } catch (error) {
        console.error('Error fetching essay:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEssay();
  }, [id, router, status]);
  
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!essay) return null;
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('essays.backToDashboard')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`${getEssayTypeColor(essay.type)} text-white py-3 px-4`}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">{essay.essay_title || t('essays.details.untitledEssay')}</h1>
            <span className="text-sm bg-white bg-opacity-20 rounded-full px-3 py-1">
              {getEssayTypeDisplay(essay.type, t)}
            </span>
          </div>
          <p className="text-sm opacity-80">
            {t('essays.details.submittedOn', { date: format(new Date(essay.submitted_at), 'MMMM d, yyyy') })}
          </p>
        </div>

        {essay.essay_prompt && (
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">{t('essays.details.essayPrompt')}</h2>
            <p className="text-gray-700">{essay.essay_prompt}</p>
          </div>
        )}

        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('essays.details.yourResponse')}</h2>
          <div className="prose max-w-none">
            {essay.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 