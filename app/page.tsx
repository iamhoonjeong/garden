'use client';
import { useRef, useEffect } from 'react';
import { canvasSizeAdjustment, canvasAnimation, addCircle } from '@/lib/canvas';
import { Circle } from '@/types/canvas';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let circles: Circle[] = [];

  useEffect(() => {
    if (!window) return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    canvasSizeAdjustment(canvas, context);
    canvasAnimation(canvas, context, circles);

    canvas.addEventListener('mousemove', (e) => addCircle(e, circles));
    return () => {
      canvas.removeEventListener('mousemove', (e) => addCircle(e, circles));
    };
  }, []);

  return (
    <div className="container">
      {process.env.NEXT_PUBLIC_CONSTRUCTION === 'true' && (
        <div className="construction">
          <div>UNDER CONSTRUCTION</div>
        </div>
      )}
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
