import { Suspense } from 'react';
import WriteContent from './WriteContent';

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    }>
      <WriteContent />
    </Suspense>
  );
} 