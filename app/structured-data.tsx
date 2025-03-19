'use client';

import Script from 'next/script';

export function EducationalAppSchema() {
  return (
    <Script
      id="educational-app-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalApplication',
          'name': 'IELTS Essay Checker',
          'description': 'An application for improving IELTS writing skills with AI-powered feedback',
          'applicationCategory': 'EducationalApplication',
          'operatingSystem': 'Web',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'educationalUse': 'Practice, Self-Assessment',
          'audience': {
            '@type': 'Audience',
            'audienceType': 'IELTS Test Takers'
          }
        })
      }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'IELTS Essay Checker',
          'url': 'https://ieltsessaychecker.com',
          'logo': 'https://ieltsessaychecker.com/logo.png',
          'sameAs': [
            'https://twitter.com/ieltsessaychecker',
            'https://facebook.com/ieltsessaychecker',
            'https://instagram.com/ieltsessaychecker'
          ]
        })
      }}
    />
  );
}

export function WebsiteSchema() {
  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'IELTS Essay Checker',
          'url': 'https://ieltsessaychecker.com',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://ieltsessaychecker.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })
      }}
    />
  );
} 