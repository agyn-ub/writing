'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import EssayLimitInfo from '@/components/essays/essay-limit-info';
import Link from 'next/link';

const WORD_LIMITS = {
  ACADEMIC_TASK1: { min: 150, max: 200 },
  GENERAL_TASK1: { min: 150, max: 200 },
  TASK2: { min: 250, max: 300 },
};

type EssayType = 'ACADEMIC_TASK1' | 'GENERAL_TASK1' | 'TASK2';

type EssayPrompt = {
  id: number;
  title: string;
  type: EssayType;
  prompt: string;
  imageUrl: string | null;
};

export default function WritePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') as EssayType) || 'TASK2';
  const essayBankId = searchParams.get('essayBankId');
  
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [essayPrompt, setEssayPrompt] = useState<EssayPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageText, setImageText] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showLimitInfo, setShowLimitInfo] = useState(false);

  // The current essay type is determined by either the essay prompt or URL param
  const currentType = essayPrompt?.type || type;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [essay]);

  useEffect(() => {
    const fetchEssayPrompt = async () => {
      if (!essayBankId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/essay-bank?id=${essayBankId}`);
        if (response.ok) {
          const data = await response.json();
          setEssayPrompt(data);
          
          // Only fetch image text for Academic Task 1 essays
          if (data.type === 'ACADEMIC_TASK1' && data.imageUrl) {
            try {
              const textResponse = await fetch(`${data.imageUrl}.txt`);
              if (textResponse.ok) {
                const text = await textResponse.text();
                setImageText(text);
              }
            } catch (error) {
              console.error('Error fetching image text:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching essay prompt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEssayPrompt();
  }, [essayBankId]);

  const getDefaultPrompt = () => {
    switch (currentType) {
      case 'ACADEMIC_TASK1':
        return 'Describe the graph/chart/diagram in your own words. You should write at least 150 words.';
      case 'GENERAL_TASK1':
        return 'Write a letter addressing the given situation. You should write at least 150 words.';
      case 'TASK2':
        return 'Write an essay responding to the question. You should write at least 250 words.';
      default:
        return '';
    }
  };

  const getEssayTypeDisplay = () => {
    switch (currentType) {
      case 'ACADEMIC_TASK1':
        return 'Academic Task 1';
      case 'GENERAL_TASK1':
        return 'General Task 1';
      case 'TASK2':
        return 'Task 2';
      default:
        return 'Essay';
    }
  };

  const handleSubmit = async () => {
    if (status !== 'authenticated') {
      setSubmitError('You must be signed in to submit an essay');
      return;
    }

    // Show limit info if word count is outside the allowed range
    if (!isWithinLimit) {
      setShowLimitInfo(true);
      setSubmitError(`Your essay must be between ${min} and ${max} words`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/essays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: essay,
          type: currentType,
          essayBankId: essayPrompt?.id || null,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Optionally redirect to the dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const data = await response.json();
        setSubmitError(data.message || data.error || 'Failed to submit essay');
        setShowLimitInfo(true);
      }
    } catch (error) {
      console.error('Error submitting essay:', error);
      setSubmitError('An error occurred while submitting your essay');
    } finally {
      setSubmitting(false);
    }
  };

  const { min, max } = WORD_LIMITS[currentType];
  const isWithinLimit = wordCount >= min && wordCount <= max;

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 pt-16 pb-20">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{getEssayTypeDisplay()}</h1>
          <div className="ml-2">
            <EssayLimitInfo selectedType={currentType} />
          </div>
        </div>
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('write.backToDashboard')}
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      ) : (
        <>
          {/* Only show images for Academic Task 1 essays */}
          {currentType === 'ACADEMIC_TASK1' && essayPrompt?.imageUrl && !imageError && !imageText && (
            <div className="mb-4 relative h-64 w-full">
              <Image
                src={essayPrompt.imageUrl}
                alt={essayPrompt.title}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          
          {imageText && currentType === 'ACADEMIC_TASK1' && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">{t('write.chartDescription')}</h3>
              <p className="whitespace-pre-line text-sm">{imageText}</p>
            </div>
          )}
          
          {imageError && !imageText && currentType === 'ACADEMIC_TASK1' && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700">
                {t('write.chartNotAvailable')}
              </p>
            </div>
          )}
          
          {/* Task-specific instructions */}
          {currentType === 'GENERAL_TASK1' && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold mb-2">{t('write.letterGuidelinesTitle')}</h3>
              <ul className="list-disc pl-5 text-sm text-blue-800">
                <li>{t('write.letterGuidelines.salutation')}</li>
                <li>{t('write.letterGuidelines.paragraphs')}</li>
                <li>{t('write.letterGuidelines.language')}</li>
                <li>{t('write.letterGuidelines.address')}</li>
              </ul>
            </div>
          )}
          
          {currentType === 'TASK2' && (
            <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold mb-2">{t('write.essayGuidelinesTitle')}</h3>
              <ul className="list-disc pl-5 text-sm text-purple-800">
                <li>{t('write.essayGuidelines.structure')}</li>
                <li>{t('write.essayGuidelines.position')}</li>
                <li>{t('write.essayGuidelines.support')}</li>
                <li>{t('write.essayGuidelines.vocabulary')}</li>
              </ul>
            </div>
          )}
          
          <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">{essayPrompt?.title || getEssayTypeDisplay()}</h2>
              <span className="text-sm text-gray-600">
                {t('write.wordLimit')} {min}-{max} {t('write.words')}
              </span>
            </div>
            <p className="text-gray-700">{essayPrompt?.prompt || getDefaultPrompt()}</p>
          </div>
        </>
      )}

      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={t('write.placeholder')}
      />

      <div className="mt-2 flex justify-between items-center">
        <span className={`text-sm ${isWithinLimit ? 'text-green-600' : 'text-red-600'}`}>
          {wordCount} {t('write.words')} {!isWithinLimit && `(${t('write.required')} ${min}-${max})`}
        </span>
      </div>

      {submitError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{submitError}</p>
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-4">
        <button
          onClick={() => setEssay('')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={submitting}
        >
          {t('write.clear')}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isWithinLimit || submitting}
          className={`px-6 py-2 rounded-md ${
            isWithinLimit && !submitting
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          {submitting ? t('write.submitting') : t('write.submit')}
        </button>
      </div>

      {showLimitInfo && (
        <div className="mt-4">
          <EssayLimitInfo selectedType={currentType} />
        </div>
      )}
    </div>
  );
} 