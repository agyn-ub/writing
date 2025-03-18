'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white font-bold text-xl">IELTS Essay Checker</span>
            </Link>
            {session && (
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <Link
                    href="/dashboard"
                    className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/dashboard')}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/academic-task1"
                    className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/academic-task1')}`}
                  >
                    Academic Task 1
                  </Link>
                  <Link
                    href="/general-task1"
                    className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/general-task1')}`}
                  >
                    General Task 1
                  </Link>
                  <Link
                    href="/task2"
                    className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/task2')}`}
                  >
                    Task 2
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm">{session.user?.name}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {session && (
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  /* Icon when menu is open */
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            )}
            
            {!session && (
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && session && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/dashboard')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/academic-task1"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/academic-task1')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Academic Task 1
            </Link>
            <Link
              href="/general-task1"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/general-task1')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              General Task 1
            </Link>
            <Link
              href="/task2"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/task2')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Task 2
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  {session.user?.image ? (
                    <img className="h-10 w-10 rounded-full" src={session.user.image} alt="" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{session.user?.name}</div>
                  <div className="text-sm font-medium leading-none text-gray-400 mt-1">{session.user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 