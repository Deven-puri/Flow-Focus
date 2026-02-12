'use client';

import { useState, useEffect } from 'react';
import { Loader2, BookOpen, X } from 'lucide-react';

interface WordTooltipProps {
  word: string;
  x: number;
  y: number;
  onClose: () => void;
}

export default function WordTooltip({ word, x, y, onClose }: WordTooltipProps) {
  const [definition, setDefinition] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDefinition = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/define', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch definition');
        }

        const data = await response.json();
        setDefinition(data.definition);
      } catch (err) {
        setError('Could not load definition');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  const tooltipX = Math.max(20, Math.min(x - 150, window.innerWidth - 320));
  const tooltipY = Math.max(80, y - 120);

  return (
    <div
      className="fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
      style={{
        left: `${tooltipX}px`,
        top: `${tooltipY}px`,
      }}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-lg">{word}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Loading definition...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <p className="text-gray-700 leading-relaxed">{definition}</p>
        )}
      </div>

      <div
        className="absolute w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45"
        style={{
          bottom: '-8px',
          left: '50%',
          marginLeft: '-8px',
        }}
      />
    </div>
  );
}
