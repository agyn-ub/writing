'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface DeferredSectionProps {
  children: ReactNode;
  threshold?: number;
  placeholderHeight?: string;
  placeholderClassName?: string;
  rootMargin?: string;
}

export default function DeferredSection({
  children,
  threshold = 0.1,
  placeholderHeight = '200px',
  placeholderClassName = '',
  rootMargin = '200px',
}: DeferredSectionProps) {
  const [loaded, setLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
    rootMargin,
  });

  useEffect(() => {
    if (inView) {
      setLoaded(true);
    }
  }, [inView]);

  return (
    <div ref={ref}>
      {loaded ? (
        children
      ) : (
        <div 
          className={`bg-gray-100 animate-pulse rounded-md ${placeholderClassName}`} 
          style={{ minHeight: placeholderHeight }}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 