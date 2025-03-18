'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface EssayBank {
  id: number;
  title: string;
  type: 'ACADEMIC_TASK1' | 'GENERAL_TASK1' | 'TASK2';
  prompt: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AcademicTask1Page() {
  const [essays, setEssays] = useState<EssayBank[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchEssays() {
      try {
        const response = await fetch('/api/essay-bank?type=ACADEMIC_TASK1');
        if (!response.ok) {
          throw new Error('Failed to fetch essays');
        }
        const data = await response.json();
        setEssays(data);
      } catch (error) {
        console.error('Error fetching essays:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEssays();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Academic Task 1 Essays</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Academic Task 1 Essays</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>Please sign in to view and practice essays.</p>
          <Link href="/login" className="text-blue-600 hover:underline mt-2 inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Academic Task 1 Essays</h1>
      
      {essays.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No essays available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essays.map((essay) => (
            <div key={essay.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                {essay.imageUrl ? (
                  <Image
                    src={essay.imageUrl}
                    alt={essay.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-chart.png';
                    }}
                  />
                ) : (
                  <Image
                    src="/images/placeholder-chart.png"
                    alt="Placeholder"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{essay.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{essay.prompt}</p>
                <button
                  onClick={() => router.push(`/write?essayBankId=${essay.id}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Start Writing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 