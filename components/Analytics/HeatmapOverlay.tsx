'use client';

import { useEffect, useRef } from 'react';

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

interface HeatmapOverlayProps {
  data: HeatmapPoint[];
  width?: number;
  height?: number;
}

export default function HeatmapOverlay({
  data,
  width = 1000,
  height = 600,
}: HeatmapOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    data.forEach((point) => {
      const radius = 50;
      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        radius
      );

      const intensity = Math.min(point.value / 20, 1);

      gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.6})`);
      gradient.addColorStop(0.3, `rgba(255, 100, 0, ${intensity * 0.4})`);
      gradient.addColorStop(0.6, `rgba(255, 200, 0, ${intensity * 0.2})`);
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(
        point.x - radius,
        point.y - radius,
        radius * 2,
        radius * 2
      );
    });

    ctx.filter = 'blur(20px)';
    ctx.globalCompositeOperation = 'source-over';
  }, [data, width, height]);

  return (
    <div className="relative" style={{ width, height }}>
      <div className="absolute inset-0 p-8 text-gray-400 select-none overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">Sample Reading Content</h2>
        <p className="mb-3 leading-relaxed">
          The unprecedented acceleration of global climate change has created a
          cascade of economic challenges that governments and businesses must
          navigate. Environmental economists warn that the financial
          ramifications of rising temperatures extend far beyond the immediate
          costs of natural disasters.
        </p>
        <p className="mb-3 leading-relaxed">
          Infrastructure deterioration represents one of the most significant
          expenses. Roads, bridges, and buildings designed for historical
          temperature ranges are experiencing accelerated degradation.
        </p>
        <p className="leading-relaxed">
          Agricultural productivity faces existential threats as traditional
          growing seasons become increasingly unpredictable. Farmers who have
          cultivated crops for generations must now contend with erratic
          precipitation patterns.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
      />
    </div>
  );
}
