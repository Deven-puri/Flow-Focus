/**
 * Reader Page
 * Main reading interface with eye tracking
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import EyeTracker from '@/components/Reader/EyeTracker';
import Calibration from '@/components/Reader/Calibration';
import WordTooltip from '@/components/Reader/WordTooltip';
import { useGazeLogic } from '@/hooks/useGazeLogic';
import { BookOpen, Camera } from 'lucide-react';

export default function ReaderPage() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    word: string;
    x: number;
    y: number;
  } | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);

  const {
    currentTarget,
    isDwelling,
    processGazePoint,
    getDwellProgress,
    resetDwell,
  } = useGazeLogic(3000); // 3 second threshold

  // Handle gaze updates from eye tracker
  const handleGazeUpdate = useCallback(
    (x: number, y: number) => {
      processGazePoint(x, y, (event) => {
        // Dwell threshold reached - show tooltip
        setTooltipData({
          word: event.target.word,
          x,
          y,
        });
      });

      // Update progress indicator
      setDwellProgress(getDwellProgress());
    },
    [processGazePoint, getDwellProgress]
  );

  // Parse text into gaze-targetable words
  const parseTextIntoWords = (text: string) => {
    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className="gaze-target inline-block px-1 py-0.5 transition-colors hover:bg-blue-50 rounded cursor-pointer"
      >
        {word}{' '}
      </span>
    ));
  };

  // Sample reading content
  const sampleContent = {
    title: 'The Economic Impact of Climate Change',
    paragraphs: [
      'The unprecedented acceleration of global climate change has created a cascade of economic challenges that governments and businesses must navigate. Environmental economists warn that the financial ramifications of rising temperatures extend far beyond the immediate costs of natural disasters.',
      'Infrastructure deterioration represents one of the most significant expenses. Roads, bridges, and buildings designed for historical temperature ranges are experiencing accelerated degradation. The phenomenon of thermal expansion in materials, combined with increased freeze-thaw cycles in temperate regions, necessitates costly premature replacements.',
      'Agricultural productivity faces existential threats as traditional growing seasons become increasingly unpredictable. Farmers who have cultivated crops for generations must now contend with erratic precipitation patterns and the proliferation of invasive pest species that thrive in warmer conditions.',
      'The insurance industry confronts an unprecedented actuarial crisis. Traditional risk assessment models, predicated on historical climate data, have become obsolete. Companies are recalibrating their methodologies to accommodate the escalating frequency of catastrophic weather events.',
    ],
  };

  // Permission request screen
  if (!permissionGranted) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-2xl p-8">
          <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Camera Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            Gaze Guide needs access to your camera to track your eye movements.
            Your camera feed is processed locally and never sent to any server.
          </p>
          <button
            onClick={() => setPermissionGranted(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-xl transition-all hover:scale-105"
          >
            Grant Camera Access & Start Calibration
          </button>
          <p className="text-xs text-gray-400 mt-4">
            🔒 Privacy first: All processing happens in your browser
          </p>
        </div>
      </div>
    );
  }

  // Calibration screen (with WebGazer running in background)
  if (!isCalibrated) {
    return (
      <>
        {/* Start WebGazer DURING calibration */}
        <EyeTracker onGazeUpdate={() => {}} showPredictionDot={false} />
        <Calibration onComplete={() => setIsCalibrated(true)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Eye Tracker with prediction dot visible after calibration */}
      <EyeTracker onGazeUpdate={handleGazeUpdate} showPredictionDot={true} />

      {/* Reading Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              {sampleContent.title}
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            👁️ Look at any word for 3 seconds to get an AI-powered definition
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-10 space-y-6">
          {sampleContent.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg leading-relaxed text-gray-700 font-serif"
            >
              {parseTextIntoWords(paragraph)}
            </p>
          ))}
        </div>

        {/* Dwell Progress Indicator */}
        {currentTarget && !isDwelling && dwellProgress > 0 && (
          <div
            className="fixed pointer-events-none z-40"
            style={{
              left: `${currentTarget.bounds.left + currentTarget.bounds.width / 2}px`,
              top: `${currentTarget.bounds.top - 40}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-white rounded-full shadow-lg p-2">
              <div className="relative w-8 h-8">
                <svg className="transform -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - dwellProgress)}`}
                    className="transition-all duration-100"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Word Tooltip */}
        {tooltipData && (
          <WordTooltip
            word={tooltipData.word}
            x={tooltipData.x}
            y={tooltipData.y}
            onClose={() => {
              setTooltipData(null);
              resetDwell();
            }}
          />
        )}
      </div>
    </div>
  );
}
