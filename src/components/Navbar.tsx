'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === '/login') {
    return null;
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/students" className="flex items-center px-2 text-gray-900 font-bold">
              Riding School Manager
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/students"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/students'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </Link>
              <Link
                href="/lessons"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/lessons'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lessons
              </Link>
              <Link
                href="/competitions"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/competitions'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Competitions
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">{user.email}</span>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
                  