'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export default function AuditComponent() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const startAudit = () => {
    setIsAuditing(true);
    // This would typically connect to an API or use browser APIs to gather metrics
    setTimeout(() => {
      gatherPerformanceMetrics();
    }, 2000);
  };

  const gatherPerformanceMetrics = () => {
    if (typeof window === 'undefined') return;

    // Use performance API to gather metrics
    const performanceEntries = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = window.performance.getEntriesByType('paint');
    
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    
    const domComplete = performanceEntries.domComplete;
    const loadTime = performanceEntries.loadEventEnd - performanceEntries.startTime;
    const ttfb = performanceEntries.responseStart - performanceEntries.requestStart;

    // Create metrics array with ratings
    const newMetrics: PerformanceMetric[] = [
      {
        name: 'First Paint',
        value: Math.round(firstPaint),
        rating: firstPaint < 1000 ? 'good' : firstPaint < 2000 ? 'needs-improvement' : 'poor'
      },
      {
        name: 'First Contentful Paint',
        value: Math.round(firstContentfulPaint),
        rating: firstContentfulPaint < 1800 ? 'good' : firstContentfulPaint < 3000 ? 'needs-improvement' : 'poor'
      },
      {
        name: 'DOM Complete',
        value: Math.round(domComplete),
        rating: domComplete < 2500 ? 'good' : domComplete < 4000 ? 'needs-improvement' : 'poor'
      },
      {
        name: 'Total Load Time',
        value: Math.round(loadTime),
        rating: loadTime < 3000 ? 'good' : loadTime < 6000 ? 'needs-improvement' : 'poor'
      },
      {
        name: 'Time to First Byte',
        value: Math.round(ttfb),
        rating: ttfb < 200 ? 'good' : ttfb < 500 ? 'needs-improvement' : 'poor'
      }
    ];

    setMetrics(newMetrics);
    generateSuggestions(newMetrics);
    setIsAuditing(false);
  };

  const generateSuggestions = (metrics: PerformanceMetric[]) => {
    const newSuggestions: string[] = [];

    // Based on metrics, generate suggestions
    const poorMetrics = metrics.filter(m => m.rating === 'poor');
    const needsImprovementMetrics = metrics.filter(m => m.rating === 'needs-improvement');

    if (poorMetrics.length > 0) {
      poorMetrics.forEach(metric => {
        switch (metric.name) {
          case 'First Paint':
          case 'First Contentful Paint':
            newSuggestions.push('Optimize critical rendering path by reducing render-blocking resources');
            newSuggestions.push('Consider using the DeferredSection component for below-the-fold content');
            break;
          case 'DOM Complete':
            newSuggestions.push('Reduce JavaScript bundle size by implementing code splitting');
            newSuggestions.push('Optimize third-party scripts loading with async or defer attributes');
            break;
          case 'Total Load Time':
            newSuggestions.push('Optimize and compress images to reduce page weight');
            newSuggestions.push('Implement proper caching strategies for static assets');
            break;
          case 'Time to First Byte':
            newSuggestions.push('Implement server-side caching to improve response times');
            newSuggestions.push('Consider using a CDN for delivering static assets');
            break;
        }
      });
    }

    if (needsImprovementMetrics.length > 0 && newSuggestions.length < 3) {
      needsImprovementMetrics.forEach(metric => {
        if (metric.name === 'First Paint' || metric.name === 'First Contentful Paint') {
          newSuggestions.push('Preload critical assets to improve rendering performance');
        }
      });
    }

    // Add general suggestions if there aren't many specific ones
    if (newSuggestions.length < 3) {
      newSuggestions.push('Implement lazy loading for images below the fold');
      newSuggestions.push('Consider implementing a service worker for offline capabilities');
      newSuggestions.push('Use modern image formats like WebP where supported');
    }

    // Remove duplicates
    const uniqueSuggestions = Array.from(new Set(newSuggestions));
    setSuggestions(uniqueSuggestions.slice(0, 5)); // Limit to top 5 suggestions
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-amber-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Performance Audit</h2>
      
      {metrics.length === 0 && (
        <div className="text-center mb-6">
          <p className="mb-4">Run a performance audit to analyze this page's loading speed and get optimization suggestions.</p>
          <button
            onClick={startAudit}
            disabled={isAuditing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isAuditing ? 'Analyzing...' : 'Start Audit'}
          </button>
        </div>
      )}

      {isAuditing && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p>Analyzing page performance...</p>
        </div>
      )}

      {metrics.length > 0 && !isAuditing && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{metric.name}</span>
                    <span className={`font-bold ${getRatingColor(metric.rating)}`}>
                      {metric.value}ms
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          metric.rating === 'good' 
                            ? 'bg-green-600' 
                            : metric.rating === 'needs-improvement' 
                              ? 'bg-amber-500' 
                              : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(100, (metric.value / 5000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Optimization Suggestions</h3>
            <ul className="list-disc pl-5 space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              onClick={startAudit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Re-run Audit
            </button>
            <button
              onClick={() => {
                setMetrics([]);
                setSuggestions([]);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Clear Results
            </button>
          </div>
        </>
      )}
    </div>
  );
} 