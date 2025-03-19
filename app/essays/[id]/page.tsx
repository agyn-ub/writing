import { Suspense } from 'react';
import EssayContent from './EssayContent';

// Server component
export default async function EssayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <EssayContent id={id} />
    </Suspense>
  );
} 