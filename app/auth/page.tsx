'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Eye, Users, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/reader');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-3 mb-4 hover:opacity-80 transition-opacity">
            <Eye className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gaze Guide
            </h1>
          </Link>
          <p className="text-gray-600 text-lg">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <Link href="/sign-in">
            <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
              <LogIn className="w-5 h-5" />
              Sign In to Your Account
            </button>
          </Link>

          <Link href="/sign-up">
            <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
              <UserPlus className="w-5 h-5" />
              Create New Account
            </button>
          </Link>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Link href="/reader?guest=true">
            <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
              <Users className="w-5 h-5" />
              Continue as Guest
            </button>
          </Link>

          <p className="text-xs text-gray-400 text-center mt-4">
            💡 Guest mode: Try the app without saving history
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          🔒 Your data is secure and private
        </p>
      </div>
    </div>
  );
}
