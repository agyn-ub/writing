import { Suspense } from 'react';
import MyEssaysContent from './MyEssaysContent';

export default function MyEssaysPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Essays</h1>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <MyEssaysContent />
    </Suspense>
  );
} 