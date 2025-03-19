'use client';

import { useEffect, useState } from 'react';
import AuditComponent from '../components/AuditComponent';
import DeferredSection from '../components/DeferredSection';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// SEO-related metrics to display
const seoMetrics = [
  {
    name: 'Meta Description',
    status: 'good',
    description: 'Meta description properly configured with keywords and accurate page description.'
  },
  {
    name: 'Structured Data',
    status: 'good',
    description: 'Schema markup implemented for EducationalApplication, Organization, and Website.'
  },
  {
    name: 'Heading Structure',
    status: 'good',
    description: 'Proper H1-H3 hierarchy implemented across pages.'
  },
  {
    name: 'Image Optimization',
    status: 'needs-improvement',
    description: 'Some images could benefit from better alt text and optimization for size.'
  },
  {
    name: 'Mobile Responsiveness',
    status: 'good',
    description: 'Site is fully responsive across all device sizes.'
  },
  {
    name: 'URL Structure',
    status: 'good',
    description: 'URLs are semantic and readable.'
  }
];

// Accessibility-related metrics
const accessibilityMetrics = [
  {
    name: 'ARIA Labels',
    status: 'good',
    description: 'Interactive elements have appropriate ARIA attributes.'
  },
  {
    name: 'Color Contrast',
    status: 'good',
    description: 'Text colors provide sufficient contrast against backgrounds.'
  },
  {
    name: 'Keyboard Navigation',
    status: 'needs-improvement',
    description: 'Some interactive elements could improve keyboard focus states.'
  },
  {
    name: 'Form Accessibility',
    status: 'good',
    description: 'Form elements have proper labels and error handling.'
  }
];

export default function AuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Only allow authenticated users to access this page
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setPageReady(true);
    }
  }, [status, router]);

  if (!pageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'needs-improvement':
        return 'bg-amber-100 text-amber-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Site Audit & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
            </svg>
            SEO Score
          </h2>
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold text-blue-600">92<span className="text-xl text-gray-400">/100</span></div>
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Performance Score
          </h2>
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold text-green-600">87<span className="text-xl text-gray-400">/100</span></div>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Accessibility Score
          </h2>
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold text-purple-600">90<span className="text-xl text-gray-400">/100</span></div>
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">SEO Checklist</h2>
          <ul className="space-y-4">
            {seoMetrics.map((metric, index) => (
              <li key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{metric.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status === 'good' ? 'Good' : metric.status === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{metric.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Accessibility Checklist</h2>
          <ul className="space-y-4">
            {accessibilityMetrics.map((metric, index) => (
              <li key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{metric.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status === 'good' ? 'Good' : metric.status === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{metric.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <DeferredSection>
        <AuditComponent />
      </DeferredSection>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <p className="mb-4">Based on the audit results, here are some recommended actions to improve your site's performance and SEO:</p>
        
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Optimize images with better compression and consider implementing WebP format</li>
          <li>Improve keyboard focus states for interactive elements</li>
          <li>Add better alt text to all images</li>
          <li>Implement a service worker for offline capabilities</li>
          <li>Consider preloading critical assets</li>
        </ul>
        
        <div className="flex justify-end">
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 