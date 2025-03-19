import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/ui/navbar';
import { Providers } from './providers';
import { Metadata } from 'next';
import { EducationalAppSchema, OrganizationSchema, WebsiteSchema } from './structured-data';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IELTS Essay Checker | Improve Your IELTS Writing Score',
  description: 'Enhance your IELTS writing skills with AI-powered essay checking, get instant feedback on Academic Task 1, General Task 1, and Task 2 essays.',
  keywords: 'IELTS, essay checker, academic writing, IELTS preparation, IELTS task 1, IELTS task 2',
  authors: [{ name: 'IELTS Essay Checker Team' }],
  creator: 'IELTS Essay Checker',
  publisher: 'IELTS Essay Checker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'IELTS Essay Checker | Improve Your IELTS Writing Score',
    description: 'Enhance your IELTS writing skills with AI-powered essay checking, get instant feedback on Academic Task 1, General Task 1, and Task 2 essays.',
    url: 'https://ieltsessaychecker.com',
    siteName: 'IELTS Essay Checker',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IELTS Essay Checker | Improve Your IELTS Writing Score',
    description: 'Enhance your IELTS writing skills with AI-powered essay checking.',
    creator: '@ieltsessaychecker',
  },
  alternates: {
    canonical: 'https://ieltsessaychecker.com',
    languages: {
      'en-US': 'https://ieltsessaychecker.com',
      'hi-IN': 'https://ieltsessaychecker.com/hi',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </Providers>
        <EducationalAppSchema />
        <OrganizationSchema />
        <WebsiteSchema />
      </body>
    </html>
  );
}
