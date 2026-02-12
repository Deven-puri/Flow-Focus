/**
 * Calibration Component
 * Game-like 9-dot calibration for WebGazer
 */

'use client';

import { useState, useEffect } from 'react';
import { Target, Check } from 'lucide-react';

interface CalibrationPoint {
  x: number;
  y: number;
  clicks: number;
  id: number;
}

interface CalibrationProps {
  onComplete: () => void;
  requiredClicksPerPoint?: number;
}

export default function Calibration({ onComplete, requiredClicksPerPoint = 5 }: CalibrationProps) {
  const [points, setPoints] = useState<CalibrationPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Generate 9 calibration points in a grid
    const generatePoints = () => {
      const margin = 100;
      const width = window.innerWidth - margin * 2;
      const height = window.innerHeight - margin * 2;

      return [
        // Top row
        { x: margin, y: margin, clicks: 0, id: 0 },
        { x: margin + width / 2, y: margin, clicks: 0, id: 1 },
        { x: margin + width, y: margin, clicks: 0, id: 2 },
        // Middle row
        { x: margin, y: margin + height / 2, clicks: 0, id: 3 },
        { x: margin + width / 2, y: margin + height / 2, clicks: 0, id: 4 },
        { x: margin + width, y: margin + height / 2, clicks: 0, id: 5 },
        // Bottom row
        { x: margin, y: margin + height, clicks: 0, id: 6 },
        { x: margin + width / 2, y: margin + height, clicks: 0, id: 7 },
        { x: margin + width, y: margin + height, clicks: 0, id: 8 },
      ];
    };

    setPoints(generatePoints());
  }, []);

  const handlePointClick = (pointId: number) => {
    setPoints((prevPoints) => {
      const newPoints = prevPoints.map((point) => {
        if (point.id === pointId && point.clicks < requiredClicksPerPoint) {
          // Record this click with WebGazer for training
          if (window.webgazer) {
            // Force WebGazer to record this as a training point
            window.webgazer.recordScreenPosition(point.x, point.y, 'click');
          }
          return { ...point, clicks: point.clicks + 1 };
        }
        return point;
      });

      // Check if current point is complete
      const clickedPoint = newPoints.find((p) => p.id === pointId);
      if (clickedPoint && clickedPoint.clicks === requiredClicksPerPoint) {
        // Move to next incomplete point
        const nextPoint = newPoints.find((p) => p.clicks < requiredClicksPerPoint);
        if (nextPoint) {
          setCurrentPoint(nextPoint.id);
        } else {
          // All points complete!
          setIsComplete(true);
          setTimeout(() => onComplete(), 1000);
        }
      }

      return newPoints;
    });
  };

  const progress = points.length > 0 
    ? (points.reduce((sum, p) => sum + p.clicks, 0) / (points.length * requiredClicksPerPoint)) * 100
    : 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center">
      {/* Instructions */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isComplete ? '✅ Calibration Complete!' : '👁️ Eye Tracking Calibration'}
        </h1>
        <p className="text-gray-600 max-w-md">
          {isComplete
            ? 'Your eye tracking is now calibrated. Get ready to read!'
            : `Click each dot ${requiredClicksPerPoint} times while looking directly at it`}
        </p>
        
        {/* Progress bar */}
        <div className="mt-4 w-96 mx-auto bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Calibration points */}
      {points.map((point) => {
        const isActive = point.id === currentPoint;
        const isCompleted = point.clicks >= requiredClicksPerPoint;

        return (
          <button
            key={point.id}
            onClick={() => handlePointClick(point.id)}
            className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform ${
              isActive
                ? 'scale-125 animate-pulse shadow-2xl'
                : isCompleted
                ? 'scale-90 opacity-50'
                : 'scale-100 opacity-75'
            }`}
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              transform: `translate(-50%, -50%) ${isActive ? 'scale(1.25)' : isCompleted ? 'scale(0.9)' : 'scale(1)'}`,
              background: isCompleted
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : isActive
                ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            }}
          >
            {isCompleted ? (
              <Check className="w-8 h-8 text-white" />
            ) : (
              <Target className="w-8 h-8 text-white" />
            )}
            
            {/* Click counter */}
            {!isCompleted && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-md">
                {point.clicks}/{requiredClicksPerPoint}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
