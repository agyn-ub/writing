'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import EssayLimitInfo from '@/components/essays/essay-limit-info';

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
    switch (type) {
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

  const handleSubmit = async () => {
    if (status !== 'authenticated') {
      setSubmitError('You must be signed in to submit an essay');
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
          type: essayPrompt?.type || type,
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
      }
    } catch (error) {
      console.error('Error submitting essay:', error);
      setSubmitError('An error occurred while submitting your essay');
    } finally {
      setSubmitting(false);
    }
  };

  const { min, max } = WORD_LIMITS[essayPrompt?.type || type];
  const isWithinLimit = wordCount >= min && wordCount <= max;

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Essay Submitted Successfully!</h2>
          <p className="text-green-600 mb-4">Your essay has been submitted for review.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <h1 className="text-2xl font-bold">
                {essayPrompt?.title || 
                 (type === 'ACADEMIC_TASK1' ? 'Academic Task 1' : 
                  type === 'GENERAL_TASK1' ? 'General Task 1' : 'Task 2')}
              </h1>
              
              <EssayLimitInfo selectedType={essayPrompt?.type || type} />
            </div>
            
            {loading ? (
              <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            ) : (
              <>
                {/* Only show images for Academic Task 1 essays */}
                {essayPrompt?.type === 'ACADEMIC_TASK1' && essayPrompt?.imageUrl && !imageError && !imageText && (
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
                
                {imageText && essayPrompt?.type === 'ACADEMIC_TASK1' && (
                  <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold mb-2">Chart Description:</h3>
                    <p className="whitespace-pre-line text-sm">{imageText}</p>
                  </div>
                )}
                
                {imageError && !imageText && essayPrompt?.type === 'ACADEMIC_TASK1' && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700">
                      The chart or graph for this task is not available. Please imagine a suitable chart based on the prompt.
                    </p>
                  </div>
                )}
                
                {/* Task-specific instructions */}
                {essayPrompt?.type === 'GENERAL_TASK1' && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Letter Writing Guidelines:</h3>
                    <ul className="list-disc pl-5 text-sm text-blue-800">
                      <li>Include appropriate salutation and closing</li>
                      <li>Organize your letter into clear paragraphs</li>
                      <li>Use language appropriate to the context (formal/informal)</li>
                      <li>Address all points mentioned in the prompt</li>
                    </ul>
                  </div>
                )}
                
                {essayPrompt?.type === 'TASK2' && (
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Essay Writing Guidelines:</h3>
                    <ul className="list-disc pl-5 text-sm text-purple-800">
                      <li>Include an introduction, body paragraphs, and conclusion</li>
                      <li>Present a clear position or argument</li>
                      <li>Support your ideas with examples and explanations</li>
                      <li>Use a range of vocabulary and grammatical structures</li>
                    </ul>
                  </div>
                )}
                
                <p className="text-gray-600 mb-4">{essayPrompt?.prompt || getDefaultPrompt()}</p>
              </>
            )}
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Word limit: {min}-{max} words
              </span>
              <span className={`text-sm ${isWithinLimit ? 'text-green-600' : 'text-red-600'}`}>
                Current: {wordCount} words
              </span>
            </div>
          </div>

          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Start writing your essay here..."
          />

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
              Clear
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
              {submitting ? 'Submitting...' : 'Submit Essay'}
            </button>
          </div>
        </>
      )}
    </div>
  );
} 