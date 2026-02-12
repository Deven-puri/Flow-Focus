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

  useEffect(() => {
    const initWebGazer = async () => {
      try {
        const webgazer = (await import('webgazer')).default;
        window.webgazer = webgazer;

        smootherRef.current = new WeightedMovingAverage(0.6);

        gazeListenerRef.current = (data: any, elapsedTime: number) => {
          if (data && smootherRef.current && !isPaused) {
            const smoothed = smootherRef.current.smooth(data.x, data.y);

            if (predictionDotRef.current && showPredictionDot && isVisible) {
              predictionDotRef.current.style.left = `${smoothed.x}px`;
              predictionDotRef.current.style.top = `${smoothed.y}px`;
            }

            onGazeUpdate(smoothed.x, smoothed.y);
          }
        };

        webgazer
          .setGazeListener(gazeListenerRef.current)
          .begin();

        webgazer.showVideoPreview(false);
        webgazer.showPredictionPoints(false);

        webgazer.setRegression('ridge');
        webgazer.applyKalmanFilter(false);
        
        webgazer.setTracker('TFFacemesh');

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize WebGazer:', error);
      }
    };

    initWebGazer();

    return () => {
      if (window.webgazer) {
        window.webgazer.pause();
        window.webgazer.end();
      }
    };
  }, [onGazeUpdate, showPredictionDot, isVisible, isPaused]);

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

  const killSwitch = useCallback(() => {
    if (window.webgazer) {
      window.webgazer.pause();
      window.webgazer.clearData();
      setIsVisible(false);
      setIsPaused(true);
      
      localStorage.removeItem('webgazerGlobalData');
      
      alert('🔒 Eye tracking stopped and data cleared for privacy.');
    }
  }, []);

  return (
    <>
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

      <div className="fixed bottom-6 right-6 flex gap-2 z-50">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title="Recalibrate eye tracking"
        >
          <Eye className="w-5 h-5" />
        </button>

        <button
          onClick={togglePause}
          className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title={isPaused ? 'Resume tracking' : 'Pause tracking'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>

        <button
          onClick={killSwitch}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title="Stop tracking & clear data"
        >
          <EyeOff className="w-5 h-5" />
        </button>

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
