/**
 * Dashboard Page
 * Analytics and heatmap visualization with interactive charts
 */

'use client';

import { useState, useEffect } from 'react';
import HeatmapOverlay from '@/components/Analytics/HeatmapOverlay';
import { BarChart3, Eye, Clock, TrendingUp, Calendar, Book } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

export default function DashboardPage() {
  const [focusData, setFocusData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReadingTime: 0,
    wordsViewed: 0,
    avgDwellTime: 0,
    focusScore: 0,
  });

  // Mock data for charts
  const [readingTimeData, setReadingTimeData] = useState<any[]>([]);
  const [wordLookupsData, setWordLookupsData] = useState<any[]>([]);
  const [focusDistribution, setFocusDistribution] = useState<any[]>([]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Mock data - in production, fetch from database
  useEffect(() => {
    // Simulate fetching analytics data
    const mockHeatmapData = [
      { x: 300, y: 200, value: 10 },
      { x: 350, y: 210, value: 8 },
      { x: 400, y: 220, value: 12 },
      { x: 450, y: 230, value: 15 },
      { x: 500, y: 240, value: 20 },
      { x: 320, y: 350, value: 7 },
      { x: 380, y: 360, value: 9 },
      { x: 440, y: 370, value: 11 },
      { x: 600, y: 300, value: 18 },
      { x: 550, y: 450, value: 14 },
    ];

    const mockReadingTime = [
      { day: 'Mon', minutes: 45, words: 2300 },
      { day: 'Tue', minutes: 62, words: 3100 },
      { day: 'Wed', minutes: 38, words: 1900 },
      { day: 'Thu', minutes: 55, words: 2750 },
      { day: 'Fri', minutes: 71, words: 3550 },
      { day: 'Sat', minutes: 48, words: 2400 },
      { day: 'Sun', minutes: 52, words: 2600 },
    ];

    const mockWordLookups = [
      { word: 'unprecedented', count: 5 },
      { word: 'ramifications', count: 4 },
      { word: 'degradation', count: 4 },
      { word: 'proliferation', count: 3 },
      { word: 'actuarial', count: 3 },
      { word: 'existential', count: 2 },
    ];

    const mockFocusDistribution = [
      { name: 'Highly Focused', value: 42 },
      { name: 'Moderately Focused', value: 33 },
      { name: 'Light Reading', value: 18 },
      { name: 'Distracted', value: 7 },
    ];

    setFocusData(mockHeatmapData);
    setReadingTimeData(mockReadingTime);
    setWordLookupsData(mockWordLookups);
    setFocusDistribution(mockFocusDistribution);

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
            Track your focus patterns and reading behavior with interactive visualizations
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

        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Reading Time Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Weekly Reading Activity</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={readingTimeData}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorMinutes)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Focus Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Focus Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={focusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {focusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Word Lookups Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Most Looked-Up Words</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wordLookupsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="word" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]}>
                {wordLookupsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🔥 Focus Heatmap
          </h2>
          <p className="text-gray-600 mb-6">
            Red areas indicate where you spent the most time reading. This helps
            identify challenging sections and patterns in your reading behavior.
          </p>

          <div className="relative bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
            <HeatmapOverlay data={focusData} width={1000} height={600} />
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 rounded" />
              <span className="text-sm text-gray-600">Low Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded" />
              <span className="text-sm text-gray-600">Medium Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm text-gray-600">High Focus</span>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 AI-Powered Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">📈 Performance Trend</h3>
              <p className="text-blue-100">
                Your focus score improved by 12% compared to yesterday. Keep up the great work!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎯 Focus Patterns</h3>
              <p className="text-blue-100">
                You spent 34% more time on complex vocabulary sections, showing thorough comprehension.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">📚 Vocabulary Growth</h3>
              <p className="text-blue-100">
                Most looked-up word: "unprecedented" (5 times). You're expanding your vocabulary!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">⏰ Best Reading Time</h3>
              <p className="text-blue-100">
                Your peak focus occurs between 9-11 AM. Schedule important reading during this window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
