'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Eye, Users } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
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
          <p className="text-gray-600">
            Welcome back! Sign in to continue
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
                  card: 'shadow-none',
                  rootBox: 'w-full',
                  cardBox: 'shadow-none',
                },
              }}
              signUpUrl="/sign-up"
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Link href="/reader?guest=true">
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
              <Users className="w-5 h-5" />
              Continue as Guest
            </button>
          </Link>

          <p className="text-xs text-gray-400 text-center mt-4">
            💡 Guest mode: Try the app without saving history
          </p>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          🔒 Your data is secure and private
        </p>
      </div>
    </div>
  );
}
