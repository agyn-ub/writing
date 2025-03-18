'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type EssayType = 'ACADEMIC_TASK1' | 'GENERAL_TASK1' | 'TASK2';

interface EssayLimitInfoProps {
  selectedType: EssayType;
}

export default function EssayLimitInfo({ selectedType }: EssayLimitInfoProps) {
  const { data: session } = useSession();
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

  return (
    <div className={`text-sm rounded-md p-2 inline-flex items-center ${
      hasSubmittedSelected 
        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
        : 'bg-green-50 text-green-800 border border-green-200'
    }`}>
      <span className={`mr-2 flex h-2 w-2 rounded-full ${
        hasSubmittedSelected ? 'bg-amber-500' : 'bg-green-500'
      }`}></span>
      {hasSubmittedSelected 
        ? `You've already submitted a ${selectedType.replace('_', ' ')} essay today` 
        : `You can submit one ${selectedType.replace('_', ' ')} essay today`
      }
    </div>
  );
} 