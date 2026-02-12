'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface GazeTarget {
  element: HTMLElement;
  word: string;
  context: string;
  bounds: DOMRect;
}

export interface DwellEvent {
  target: GazeTarget;
  dwellTime: number;
}

export function useGazeLogic(dwellThreshold = 3000) {
  const [currentTarget, setCurrentTarget] = useState<GazeTarget | null>(null);
  const [dwellStartTime, setDwellStartTime] = useState<number | null>(null);
  const [isDwelling, setIsDwelling] = useState(false);
  const [gazeHistory, setGazeHistory] = useState<GazePoint[]>([]);

  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTargetRef = useRef<string | null>(null);

  const clearDwellTimer = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
  }, []);

  const resetDwell = useCallback(() => {
    clearDwellTimer();
    setDwellStartTime(null);
    setIsDwelling(false);
    lastTargetRef.current = null;
  }, [clearDwellTimer]);

  // Check if point is inside bounding box
  const isPointInBounds = useCallback((x: number, y: number, bounds: DOMRect): boolean => {
    return (
      x >= bounds.left &&
      x <= bounds.right &&
      y >= bounds.top &&
      y <= bounds.bottom
    );
  }, []);

  const getTargetAtPoint = useCallback((x: number, y: number): GazeTarget | null => {
    const element = document.elementFromPoint(x, y) as HTMLElement;
    
    if (!element) return null;

    let targetElement: HTMLElement | null = element;
    
    while (targetElement && !targetElement.classList.contains('gaze-target')) {
      targetElement = targetElement.parentElement;
    }

    if (!targetElement) return null;

    const word = targetElement.textContent || '';
    
    let context = '';
    const paragraph = targetElement.closest('p');
    if (paragraph) {
      context = paragraph.textContent || '';
    }

    return {
      element: targetElement,
      word,
      context,
      bounds: targetElement.getBoundingClientRect(),
    };
  }, []);

  const processGazePoint = useCallback(
    (x: number, y: number, onDwell?: (event: DwellEvent) => void) => {
      const timestamp = Date.now();
      
      setGazeHistory((prev) => {
        const newHistory = [...prev, { x, y, timestamp }];
        return newHistory.slice(-1000);
      });

      const target = getTargetAtPoint(x, y);

      if (!target) {
        // Not looking at any target, reset
        if (currentTarget) {
          setCurrentTarget(null);
          resetDwell();
        }
        return;
      }

      const targetId = `${target.word}-${target.bounds.left}-${target.bounds.top}`;

      // Check if we're looking at the same target
      if (lastTargetRef.current === targetId) {
        // Continue dwelling
        if (dwellStartTime && !isDwelling) {
          const dwellTime = timestamp - dwellStartTime;
          
          if (dwellTime >= dwellThreshold) {
            // Threshold reached!
            setIsDwelling(true);
            
            if (onDwell) {
              onDwell({ target, dwellTime });
            }
          }
        }
      } else {
        // New target, reset timer
        lastTargetRef.current = targetId;
        setCurrentTarget(target);
        setDwellStartTime(timestamp);
        setIsDwelling(false);
        clearDwellTimer();
      }
    },
    [currentTarget, dwellStartTime, isDwelling, dwellThreshold, getTargetAtPoint, resetDwell, clearDwellTimer]
  );

  // Get dwell progress (0-1)
  const getDwellProgress = useCallback((): number => {
    if (!dwellStartTime) return 0;
    const elapsed = Date.now() - dwellStartTime;
    return Math.min(elapsed / dwellThreshold, 1);
  }, [dwellStartTime, dwellThreshold]);

  // Clear gaze history
  const clearHistory = useCallback(() => {
    setGazeHistory([]);
  }, []);

  // Batch save history (for analytics)
  const getAggregatedHistory = useCallback((intervalMs = 10000) => {
    const aggregated: { [key: string]: { count: number; totalTime: number; lastTimestamp: number } } = {};

    gazeHistory.forEach((point) => {
      const target = getTargetAtPoint(point.x, point.y);
      if (target) {
        const key = target.word;
        if (!aggregated[key]) {
          aggregated[key] = { count: 0, totalTime: 0, lastTimestamp: point.timestamp };
        }
        aggregated[key].count++;
      }
    });

    return Object.entries(aggregated).map(([word, data]) => ({
      word,
      count: data.count,
      timestamp: data.lastTimestamp,
    }));
  }, [gazeHistory, getTargetAtPoint]);

  return {
    currentTarget,
    dwellStartTime,
    isDwelling,
    gazeHistory,
    processGazePoint,
    resetDwell,
    getDwellProgress,
    clearHistory,
    getAggregatedHistory,
  };
}
