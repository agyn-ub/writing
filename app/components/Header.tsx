'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Header() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">IELTS Essay Checker</h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md ${
                pathname === '/' ? 'text-blue-600 font-medium' : ''
              }`}
            >
              {t('navigation.home')}
            </Link>
            
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md ${
                    pathname === '/dashboard' ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  href="/my-essays"
                  className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md ${
                    pathname === '/my-essays' ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {t('navigation.myEssays')}
                </Link>
                <Link
                  href="/audit"
                  className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md ${
                    pathname === '/audit' ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {t('navigation.audit')}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="hidden md:flex items-center">
            <LanguageSwitcher className="mr-4" />
            
            {status === 'loading' ? (
              <div className="h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            ) : session ? (
              <div className="relative ml-3">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {t('auth.signOut')}
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  {t('auth.signIn')}
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <LanguageSwitcher className="mr-4" />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`block rounded-md px-3 py-2 ${
                pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.home')}
            </Link>
            
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block rounded-md px-3 py-2 ${
                    pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  href="/my-essays"
                  className={`block rounded-md px-3 py-2 ${
                    pathname === '/my-essays' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.myEssays')}
                </Link>
                <Link
                  href="/audit"
                  className={`block rounded-md px-3 py-2 ${
                    pathname === '/audit' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.audit')}
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  {t('auth.signOut')}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('auth.signIn')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 