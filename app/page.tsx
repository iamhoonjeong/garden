'use client';
import { useRef, useEffect } from 'react';
import { initCanvas, drawCircles, addCircle } from './lib/draw';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let circles: { pos: number; vel: number }[] = [];

  for (let i = 0; i < 12; i++) {
    circles.push({
      pos: 10 * i + 10,
      vel: 1,
    });
  }

  const animate = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) => {
    drawCircles(canvas, context, circles);

    const animateId = requestAnimationFrame(() => animate(canvas, context));
    if (false) {
      cancelAnimationFrame(animateId);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    initCanvas(canvas, context);
    animate(canvas, context);

    window.addEventListener('click', (e) => addCircle(e, circles));
    return () => {
      window.removeEventListener('click', (e) => addCircle(e, circles));
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
