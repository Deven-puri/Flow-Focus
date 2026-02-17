'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import EyeTracker from '@/components/Reader/EyeTracker';
import Calibration from '@/components/Reader/Calibration';
import WordTooltip from '@/components/Reader/WordTooltip';
import HistoryPanel from '@/components/History/HistoryPanel';
import DocumentUploader from '@/components/Reader/DocumentUploader';
import { useGazeLogic } from '@/hooks/useGazeLogic';
import { BookOpen, Camera, History, Upload, LogOut, UserCircle } from 'lucide-react';

export default function ReaderPage() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    word: string;
    x: number;
    y: number;
  } | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [customContent, setCustomContent] = useState<{
    title: string;
    text: string;
  } | null>(null);

  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuestMode = searchParams.get('guest') === 'true';

  const {
    currentTarget,
    isDwelling,
    processGazePoint,
    getDwellProgress,
    resetDwell,
  } = useGazeLogic(2500); // Reduced from 3000ms to 2500ms for better responsiveness

  useEffect(() => {
    // Allow guest mode or authenticated users
    // No redirect needed
  }, []);

  const handleGazeUpdate = useCallback(
    (x: number, y: number) => {
      processGazePoint(x, y, (event) => {
        setTooltipData({
          word: event.target.word,
          x,
          y,
        });
      });

      setDwellProgress(getDwellProgress());
    },
    [processGazePoint, getDwellProgress]
  );

  const parseTextIntoWords = (text: string) => {
    const words = text.split(/\s+/);
    return words.map((word, index) => (
      <span
        key={index}
        className="gaze-target inline-block px-1 py-0.5 transition-colors hover:bg-blue-50 rounded cursor-pointer"
        data-word={word}
      >
        {word}{' '}
      </span>
    ));
  };

  const handleDocumentLoaded = (content: string, title: string) => {
    setCustomContent({ title, text: content });
  };

  const sampleContent = customContent || {
    title: 'The Economic Impact of Climate Change',
    text: 'The unprecedented acceleration of global climate change has created a cascade of economic challenges that governments and businesses must navigate. Environmental economists warn that the financial ramifications of rising temperatures extend far beyond the immediate costs of natural disasters.\n\nInfrastructure deterioration represents one of the most significant expenses. Roads, bridges, and buildings designed for historical temperature ranges are experiencing accelerated degradation. The phenomenon of thermal expansion in materials, combined with increased freeze-thaw cycles in temperate regions, necessitates costly premature replacements.\n\nAgricultural productivity faces existential threats as traditional growing seasons become increasingly unpredictable. Farmers who have cultivated crops for generations must now contend with erratic precipitation patterns and the proliferation of invasive pest species that thrive in warmer conditions.\n\nThe insurance industry confronts an unprecedented actuarial crisis. Traditional risk assessment models, predicated on historical climate data, have become obsolete. Companies are recalibrating their methodologies to accommodate the escalating frequency of catastrophic weather events.',
  };

  const paragraphs = sampleContent.text.split('\n\n').filter(p => p.trim());

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {permissionGranted && (
        <>
          {!isCalibrated ? (
            <>
              <EyeTracker onGazeUpdate={() => {}} showPredictionDot={false} />
              <Calibration onComplete={() => setIsCalibrated(true)} />
            </>
          ) : (
            <>
              <EyeTracker onGazeUpdate={handleGazeUpdate} showPredictionDot={true} />

              {/* Top Navigation Bar */}
              <div className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-800">Gaze Guide</h1>
                    {isGuestMode && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        Guest Mode
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {!isGuestMode && (
                      <>
                        <button
                          onClick={() => setShowUploader(true)}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Load Document
                        </button>
                        <button
                          onClick={() => setShowHistory(true)}
                          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <History className="w-4 h-4" />
                          History
                        </button>
                      </>
                    )}
                    {isSignedIn ? (
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push('/sign-in')}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <UserCircle className="w-4 h-4" />
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              </div>
        
              <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    {sampleContent.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    👁️ Look at any word for 2.5 seconds to get an AI-powered definition
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-10 space-y-6">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg leading-relaxed text-gray-700 font-serif"
                    >
                      {parseTextIntoWords(paragraph)}
                    </p>
                  ))}
                </div>

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

              {!isGuestMode && (
                <>
                  <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
                  <DocumentUploader
                    isOpen={showUploader}
                    onClose={() => setShowUploader(false)}
                    onDocumentLoaded={handleDocumentLoaded}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
