'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import type { EssayBank } from '@/db/schema';
import { format } from 'date-fns';
import { useLanguage } from '@/app/contexts/LanguageContext';

// Define types for user essays
interface UserEssay {
  id: string;
  content: string;
  type: 'ACADEMIC_TASK1' | 'GENERAL_TASK1' | 'TASK2';
  submitted_at: string;
  essay_bank_id: number | null;
  essay_title: string | null;
  essay_prompt: string | null;
}

interface UserEssaysResponse {
  essays: UserEssay[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [featuredEssays, setFeaturedEssays] = useState<{
    academic: EssayBank | null;
    general: EssayBank | null;
    task2: EssayBank | null;
  }>({
    academic: null,
    general: null,
    task2: null
  });
  const [userEssays, setUserEssays] = useState<UserEssay[]>([]);
  const [userEssaysLoading, setUserEssaysLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    async function fetchFeaturedEssays() {
      setLoading(true);
      try {
        // Fetch one essay from each category
        const academicResponse = await fetch('/api/essay-bank?type=ACADEMIC_TASK1');
        const generalResponse = await fetch('/api/essay-bank?type=GENERAL_TASK1');
        const task2Response = await fetch('/api/essay-bank?type=TASK2');

        if (academicResponse.ok && generalResponse.ok && task2Response.ok) {
          const academicData = await academicResponse.json();
          const generalData = await generalResponse.json();
          const task2Data = await task2Response.json();

          setFeaturedEssays({
            academic: academicData.length > 0 ? academicData[0] : null,
            general: generalData.length > 0 ? generalData[0] : null,
            task2: task2Data.length > 0 ? task2Data[0] : null
          });
        }
      } catch (error) {
        console.error('Error fetching featured essays:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchFeaturedEssays();
    }
  }, [status]);

  // Fetch user essays
  useEffect(() => {
    async function fetchUserEssays() {
      setUserEssaysLoading(true);
      try {
        const response = await fetch('/api/user-essays?limit=5');
        if (response.ok) {
          const data: UserEssaysResponse = await response.json();
          setUserEssays(data.essays);
        }
      } catch (error) {
        console.error('Error fetching user essays:', error);
      } finally {
        setUserEssaysLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchUserEssays();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to get essay type display name
  const getEssayTypeDisplay = (type: string) => {
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('dashboard.title')}</h1>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
          {t('dashboard.welcome')}, {session?.user?.name || 'Student'}
        </h2>
        <p className="text-gray-600">
          {t('dashboard.practicePrompt')}
        </p>
      </div>

      {/* User's Recent Essays Section */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">{t('dashboard.recentEssays')}</h2>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {userEssaysLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userEssays.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.table.type')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.table.title')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.table.submitted')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userEssays.map((essay) => (
                    <tr key={essay.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getEssayTypeColor(essay.type)}`}>
                          {getEssayTypeDisplay(essay.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {essay.essay_title || t('dashboard.table.untitledEssay')}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {essay.content.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(essay.submitted_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/essays/${essay.id}`} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t('dashboard.table.view')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <Link 
                  href="/my-essays" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {t('dashboard.viewAll')} →
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t('dashboard.table.noEssays')}</p>
          )}
        </div>
      </div>

      {/* Practice Essays Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold">{t('dashboard.practiceEssays')}</h2>
        </div>
        
        <div className="mt-4 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-md font-medium text-blue-800">Daily Submission Limits</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>You can submit one essay of each type per day:</p>
                <ul className="mt-1 list-disc list-inside ml-2">
                  <li>One Academic Task 1 essay</li>
                  <li>One General Task 1 essay</li>
                  <li>One Task 2 essay</li>
                </ul>
                <p className="mt-1 text-xs text-blue-600">Limits reset at midnight in your local time zone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 w-full bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Academic Task 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white py-3 px-4">
              <h3 className="text-xl font-semibold">{t('dashboard.cards.academic.title')}</h3>
              <p className="text-sm opacity-80">{t('dashboard.cards.academic.subtitle')}</p>
            </div>
            {featuredEssays.academic ? (
              <>
                {featuredEssays.academic.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={featuredEssays.academic.imageUrl}
                      alt={featuredEssays.academic.title}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/placeholder-chart.png';
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{featuredEssays.academic.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{featuredEssays.academic.prompt}</p>
                  <Link
                    href={`/write?id=${featuredEssays.academic.id}`}
                    className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {t('dashboard.cards.academic.start')}
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">{t('dashboard.cards.academic.noEssays')}</p>
                <Link
                  href="/academic-task1"
                  className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('dashboard.cards.academic.browse')}
                </Link>
              </div>
            )}
          </div>

          {/* General Task 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white py-3 px-4">
              <h3 className="text-xl font-semibold">{t('dashboard.cards.general.title')}</h3>
              <p className="text-sm opacity-80">{t('dashboard.cards.general.subtitle')}</p>
            </div>
            {featuredEssays.general ? (
              <div className="p-4">
                <h4 className="font-semibold mb-2">{featuredEssays.general.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-4">{featuredEssays.general.prompt}</p>
                <Link
                  href={`/write?id=${featuredEssays.general.id}`}
                  className="inline-block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {t('dashboard.cards.general.start')}
                </Link>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">{t('dashboard.cards.general.noEssays')}</p>
                <Link
                  href="/general-task1"
                  className="inline-block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {t('dashboard.cards.general.browse')}
                </Link>
              </div>
            )}
          </div>

          {/* Task 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-600 text-white py-3 px-4">
              <h3 className="text-xl font-semibold">{t('dashboard.cards.task2.title')}</h3>
              <p className="text-sm opacity-80">{t('dashboard.cards.task2.subtitle')}</p>
            </div>
            {featuredEssays.task2 ? (
              <div className="p-4">
                <h4 className="font-semibold mb-2">{featuredEssays.task2.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-4">{featuredEssays.task2.prompt}</p>
                <Link
                  href={`/write?id=${featuredEssays.task2.id}`}
                  className="inline-block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  {t('dashboard.cards.task2.start')}
                </Link>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">{t('dashboard.cards.task2.noEssays')}</p>
                <Link
                  href="/task2"
                  className="inline-block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  {t('dashboard.cards.task2.browse')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 