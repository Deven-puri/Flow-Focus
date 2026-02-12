/**
 * EyeTracker Component
 * WebGazer initialization with smoothing and optimizations
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Eye, EyeOff, Pause, Play } from 'lucide-react';
import { WeightedMovingAverage } from '@/lib/filters';

interface EyeTrackerProps {
  onGazeUpdate: (x: number, y: number) => void;
  showPredictionDot?: boolean;
}

declare global {
  interface Window {
    webgazer: any;
  }
}

export default function EyeTracker({ onGazeUpdate, showPredictionDot = true }: EyeTrackerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const smootherRef = useRef<WeightedMovingAverage | null>(null);
  const gazeListenerRef = useRef<((data: any, elapsedTime: number) => void) | null>(null);
  const predictionDotRef = useRef<HTMLDivElement | null>(null);

  // Initialize WebGazer
  useEffect(() => {
    const initWebGazer = async () => {
      try {
        // Dynamically import webgazer
        const webgazer = (await import('webgazer')).default;
        window.webgazer = webgazer;

        // Initialize smoother with less aggressive smoothing for better responsiveness
        smootherRef.current = new WeightedMovingAverage(0.6); // Reduced from 0.8 for faster response

        // Set up gaze listener
        gazeListenerRef.current = (data: any, elapsedTime: number) => {
          if (data && smootherRef.current && !isPaused) {
            // Apply smoothing
            const smoothed = smootherRef.current.smooth(data.x, data.y);

            // Update prediction dot
            if (predictionDotRef.current && showPredictionDot && isVisible) {
              predictionDotRef.current.style.left = `${smoothed.x}px`;
              predictionDotRef.current.style.top = `${smoothed.y}px`;
            }

            // Notify parent
            onGazeUpdate(smoothed.x, smoothed.y);
          }
        };

        webgazer
          .setGazeListener(gazeListenerRef.current)
          .begin();

        // Hide video preview for cleaner UI
        webgazer.showVideoPreview(false);
        webgazer.showPredictionPoints(false);

        // Optimize for better performance and accuracy
        webgazer.setRegression('ridge'); // Ridge regression is most accurate
        webgazer.applyKalmanFilter(false); // Disable built-in Kalman, we use our own smoothing
        
        // Set tracker to use face detection
        webgazer.setTracker('TFFacemesh'); // More accurate face tracking

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize WebGazer:', error);
      }
    };

    initWebGazer();

    // Cleanup
    return () => {
      if (window.webgazer) {
        window.webgazer.pause();
        window.webgazer.end();
      }
    };
  }, [onGazeUpdate, showPredictionDot, isVisible, isPaused]);

  // Battery optimization: pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && window.webgazer) {
        window.webgazer.pause();
      } else if (!document.hidden && window.webgazer && !isPaused) {
        window.webgazer.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (window.webgazer) {
      if (isPaused) {
        window.webgazer.resume();
        setIsPaused(false);
      } else {
        window.webgazer.pause();
        setIsPaused(true);
      }
    }
  }, [isPaused]);

  // Privacy mode: kill switch
  const killSwitch = useCallback(() => {
    if (window.webgazer) {
      window.webgazer.pause();
      window.webgazer.clearData();
      setIsVisible(false);
      setIsPaused(true);
      
      // Clear local storage
      localStorage.removeItem('webgazerGlobalData');
      
      alert('🔒 Eye tracking stopped and data cleared for privacy.');
    }
  }, []);

  return (
    <>
      {/* Prediction Dot - larger and more visible */}
      {showPredictionDot && isVisible && !isPaused && (
        <div
          ref={predictionDotRef}
          className="fixed w-6 h-6 rounded-full pointer-events-none z-[9999]"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.6) 70%, rgba(239, 68, 68, 0) 100%)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
          }}
        />
      )}

      {/* Control Panel */}
      <div className="fixed bottom-6 right-6 flex gap-2 z-50">
        {/* Recalibrate Button */}
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title="Recalibrate eye tracking"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Pause/Resume */}
        <button
          onClick={togglePause}
          className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title={isPaused ? 'Resume tracking' : 'Pause tracking'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>

        {/* Kill Switch */}
        <button
          onClick={killSwitch}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title="Stop tracking & clear data"
        >
          <EyeOff className="w-5 h-5" />
        </button>

        {/* Status Indicator */}
        <div className="bg-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              !isVisible ? 'bg-gray-400' : isPaused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            {!isVisible ? 'Disabled' : isPaused ? 'Paused' : 'Active'}
          </span>
        </div>
      </div>
    </>
  );
}
