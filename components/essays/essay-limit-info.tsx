'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/app/contexts/LanguageContext';

type EssayType = 'ACADEMIC_TASK1' | 'GENERAL_TASK1' | 'TASK2';

interface EssayLimitInfoProps {
  selectedType: EssayType;
}

export default function EssayLimitInfo({ selectedType }: EssayLimitInfoProps) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [submittedToday, setSubmittedToday] = useState<{
    ACADEMIC_TASK1: boolean;
    GENERAL_TASK1: boolean;
    TASK2: boolean;
  }>({
    ACADEMIC_TASK1: false,
    GENERAL_TASK1: false,
    TASK2: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubmittedEssays = async () => {
      if (!session?.user) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/essays/daily-status');
        if (response.ok) {
          const data = await response.json();
          setSubmittedToday(data.submittedToday);
        }
      } catch (error) {
        console.error('Error checking essay limits:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubmittedEssays();
  }, [session]);

  if (loading) {
    return <div className="h-4 w-36 bg-gray-200 animate-pulse rounded"></div>;
  }

  const hasSubmittedSelected = submittedToday[selectedType];
  const displayType = selectedType.replace('_', ' ').toLowerCase();

  if (hasSubmittedSelected) {
    return (
      <div className="rounded-md p-2 bg-amber-50 border border-amber-200 text-amber-800 inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-medium text-sm">{t('essayLimits.dailyLimitReached')}</p>
          <p className="text-xs">{t('essayLimits.alreadySubmitted').replace('{type}', displayType)}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-md p-2 bg-green-50 border border-green-200 text-green-800 inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <div>
        <p className="font-medium text-sm">{t('essayLimits.availableForSubmission')}</p>
        <p className="text-xs">{t('essayLimits.canSubmitOne').replace('{type}', displayType)}</p>
      </div>
    </div>
  );
} 