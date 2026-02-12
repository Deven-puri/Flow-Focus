/**
 * Dashboard Page
 * Analytics and heatmap visualization
 */

'use client';

import { useState, useEffect } from 'react';
import HeatmapOverlay from '@/components/Analytics/HeatmapOverlay';
import { BarChart3, Eye, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [focusData, setFocusData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReadingTime: 0,
    wordsViewed: 0,
    avgDwellTime: 0,
    focusScore: 0,
  });

  // Mock data - in production, fetch from database
  useEffect(() => {
    // Simulate fetching analytics data
    const mockData = [
      { x: 300, y: 200, value: 10 },
      { x: 350, y: 210, value: 8 },
      { x: 400, y: 220, value: 12 },
      { x: 450, y: 230, value: 15 },
      { x: 500, y: 240, value: 20 },
      { x: 320, y: 350, value: 7 },
      { x: 380, y: 360, value: 9 },
      { x: 440, y: 370, value: 11 },
    ];

    setFocusData(mockData);

    setStats({
      totalReadingTime: 2847, // seconds
      wordsViewed: 1243,
      avgDwellTime: 2.3,
      focusScore: 87,
    });
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Reading Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your focus patterns and reading behavior
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Reading Time */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-500 font-medium">TODAY</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {formatTime(stats.totalReadingTime)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Reading Time</p>
          </div>

          {/* Words Viewed */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-500 font-medium">TODAY</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.wordsViewed.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Words Viewed</p>
          </div>

          {/* Avg Dwell Time */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-gray-500 font-medium">AVG</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.avgDwellTime}s
            </p>
            <p className="text-sm text-gray-600 mt-1">Avg Dwell Time</p>
          </div>

          {/* Focus Score */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <span className="text-sm text-gray-500 font-medium">SCORE</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.focusScore}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Focus Score</p>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🔥 Focus Heatmap
          </h2>
          <p className="text-gray-600 mb-6">
            Red areas indicate where you spent the most time reading. This helps
            identify challenging sections.
          </p>

          <div className="relative bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
            <HeatmapOverlay data={focusData} width={1000} height={600} />
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-300 rounded" />
              <span className="text-sm text-gray-600">Low Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded" />
              <span className="text-sm text-gray-600">Medium Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm text-gray-600">High Focus</span>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 AI Insights</h2>
          <div className="space-y-3">
            <p className="text-blue-100">
              • You spent 34% more time on paragraph 3, indicating challenging
              vocabulary
            </p>
            <p className="text-blue-100">
              • Your focus score improved by 12% compared to yesterday
            </p>
            <p className="text-blue-100">
              • Most looked-up word: "exacerbated" (viewed 5 times)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
