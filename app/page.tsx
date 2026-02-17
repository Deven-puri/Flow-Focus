import Link from 'next/link';
import { BookOpen, BarChart3, Eye, History, Upload, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-16 h-16 text-blue-600" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gaze Guide
            </h1>
          </div>
          <p className="text-2xl text-gray-700 mb-2">
            AI-Powered Reading Assistant with Eye Tracking
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Look at any word for 2.5 seconds, and our AI will explain it. Track your focus patterns, upload PDFs, load URLs, and save your history.
          </p>
          <Link href="/auth">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-xl transition-all hover:scale-105 text-lg">
              Get Started →
            </button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Reader Card */}
          <Link href="/auth">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Start Reading
              </h2>
              <p className="text-gray-600">
                Activate eye tracking and get instant AI definitions while reading
              </p>
              <div className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-full font-medium">
                Launch Reader →
              </div>
            </div>
          </Link>

          {/* Dashboard Card */}
          <Link href="/dashboard">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-500">
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                View Analytics
              </h2>
              <p className="text-gray-600">
                See your focus heatmaps and reading statistics
              </p>
              <div className="mt-6 inline-block bg-purple-500 text-white px-6 py-2 rounded-full font-medium">
                View Dashboard →
              </div>
            </div>
          </Link>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            ✨ Key Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-800 mb-1">9-Point Calibration</h4>
              <p className="text-sm text-gray-600">
                Game-like calibration ensures precise eye tracking
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🤖</div>
              <h4 className="font-bold text-gray-800 mb-1">AI Definitions</h4>
              <p className="text-sm text-gray-600">
                Gemini AI provides contextual word explanations
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔥</div>
              <h4 className="font-bold text-gray-800 mb-1">Focus Heatmaps</h4>
              <p className="text-sm text-gray-600">
                Visualize where you spent the most reading time
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⏱️</div>
              <h4 className="font-bold text-gray-800 mb-1">Fast Dwell Detection</h4>
              <p className="text-sm text-gray-600">
                Automatic trigger after 2.5 seconds of focus
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold text-gray-800 mb-1">PDF & URL Support</h4>
              <p className="text-sm text-gray-600">
                Upload PDFs or load articles from URLs
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💾</div>
              <h4 className="font-bold text-gray-800 mb-1">History Tracking</h4>
              <p className="text-sm text-gray-600">
                Save and review your word lookup history
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔐</div>
              <h4 className="font-bold text-gray-800 mb-1">User Authentication</h4>
              <p className="text-sm text-gray-600">
                Secure login to save your personal data
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-bold text-gray-800 mb-1">Privacy First</h4>
              <p className="text-sm text-gray-600">
                Kill switch to stop tracking and clear data
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold text-gray-800 mb-1">Optimized Performance</h4>
              <p className="text-sm text-gray-600">
                Battery-saving mode and smooth predictions
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-8 text-sm text-gray-500">
          Built with Next.js, WebGazer.js, Gemini AI, and Kalman Filtering
        </div>
      </div>
    </div>
  );
}
