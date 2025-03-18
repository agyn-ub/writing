'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

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

export default function MyEssaysPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [essays, setEssays] = useState<UserEssay[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });
  
  // Get type from search params
  const typeParam = searchParams ? searchParams.get('type') : null;
  const [activeFilter, setActiveFilter] = useState<string | null>(typeParam);

  // Calculate current page
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  // Update active filter when search params change
  useEffect(() => {
    if (searchParams) {
      setActiveFilter(searchParams.get('type'));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchEssays() {
      setLoading(true);
      try {
        const offset = searchParams ? parseInt(searchParams.get('offset') || '0') : 0;
        const limit = searchParams ? parseInt(searchParams.get('limit') || '10') : 10;
        const type = searchParams ? searchParams.get('type') : null;

        let url = `/api/user-essays?limit=${limit}&offset=${offset}`;
        if (type) {
          url += `&type=${type}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data: UserEssaysResponse = await response.json();
          setEssays(data.essays);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error fetching essays:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchEssays();
    }
  }, [status, searchParams]);

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

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Essays</h1>
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Filter buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/my-essays"
            className={`px-3 py-2 rounded-md text-sm font-medium ${!activeFilter ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            All Essays
          </Link>
          <Link 
            href="/my-essays?type=ACADEMIC_TASK1"
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === 'ACADEMIC_TASK1' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
          >
            Academic Task 1
          </Link>
          <Link 
            href="/my-essays?type=GENERAL_TASK1"
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === 'GENERAL_TASK1' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
          >
            General Task 1
          </Link>
          <Link 
            href="/my-essays?type=TASK2"
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === 'TASK2' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
          >
            Task 2
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : essays.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {essays.map((essay) => (
                    <tr key={essay.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getEssayTypeColor(essay.type)}`}>
                          {getEssayTypeDisplay(essay.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {essay.essay_title || 'Untitled Essay'}
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
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        {essay.essay_bank_id && (
                          <Link 
                            href={`/write?essayBankId=${essay.essay_bank_id}`} 
                            className="text-green-600 hover:text-green-900"
                          >
                            Try Again
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{pagination.offset + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.offset + pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> essays
                </div>
                <div className="flex space-x-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/my-essays?offset=${(currentPage - 2) * pagination.limit}&limit=${pagination.limit}${activeFilter ? `&type=${activeFilter}` : ''}`}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  {pagination.hasMore && (
                    <Link
                      href={`/my-essays?offset=${currentPage * pagination.limit}&limit=${pagination.limit}${activeFilter ? `&type=${activeFilter}` : ''}`}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't submitted any essays yet.</p>
            <Link
              href="/dashboard"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 