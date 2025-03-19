'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { EssayBank } from '@/db/schema';

export default function EssayBankContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [essays, setEssays] = useState<EssayBank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEssays() {
      setLoading(true);
      try {
        const url = type ? `/api/essay-bank?type=${type}` : '/api/essay-bank';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setEssays(data);
        }
      } catch (error) {
        console.error('Error fetching essays:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEssays();
  }, [type]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Essay Bank</h1>
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/essay-bank"
            className={`px-4 py-2 rounded-md ${!type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All Essays
          </Link>
          <Link 
            href="/essay-bank?type=ACADEMIC_TASK1"
            className={`px-4 py-2 rounded-md ${type === 'ACADEMIC_TASK1' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Academic Task 1
          </Link>
          <Link 
            href="/essay-bank?type=GENERAL_TASK1"
            className={`px-4 py-2 rounded-md ${type === 'GENERAL_TASK1' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            General Task 1
          </Link>
          <Link 
            href="/essay-bank?type=TASK2"
            className={`px-4 py-2 rounded-md ${type === 'TASK2' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Task 2
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essays.map((essay) => (
            <div key={essay.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {essay.imageUrl ? (
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={essay.imageUrl}
                    alt={essay.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Replace with a placeholder on error
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = '/images/placeholder-chart.png';
                    }}
                  />
                </div>
              ) : essay.type === 'ACADEMIC_TASK1' ? (
                <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400 text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>Chart/Graph</p>
                  </div>
                </div>
              ) : null}
              <div className="p-4">
                <div className="inline-block px-2 py-1 mb-2 text-xs font-semibold rounded-full bg-gray-100">
                  {essay.type === 'ACADEMIC_TASK1' ? 'Academic Task 1' : 
                   essay.type === 'GENERAL_TASK1' ? 'General Task 1' : 'Task 2'}
                </div>
                <h2 className="text-xl font-semibold mb-2">{essay.title}</h2>
                <p className="text-gray-600 line-clamp-3">{essay.prompt}</p>
                <Link 
                  href={`/write?type=${essay.type}&id=${essay.id}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Practice This Essay
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && essays.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No essays found.</p>
        </div>
      )}
    </div>
  );
} 