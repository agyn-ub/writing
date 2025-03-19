import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/api/', '/dashboard/', '/my-essays/', '/write/'],
      },
    ],
    sitemap: 'https://ieltsessaychecker.com/sitemap.xml',
    host: 'https://ieltsessaychecker.com',
  };
} 