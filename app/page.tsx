'use client';
import { useRef, useEffect } from 'react';
import { drawCircles } from './lib/draw';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let circles: { pos: number; vel: number }[] = [];

  for (let i = 0; i < 12; i++) {
    circles.push({
      pos: 10 * i + 10,
      vel: 1,
    });
  }

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let context: CanvasRenderingContext2D = canvas.getContext('2d')!;
    let width, height, scale;

    scale = window.devicePixelRatio;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;

    context.scale(scale, scale);

    drawCircles(canvas, context, width, height, circles);

    const animateId = requestAnimationFrame(animate);
    if (false) {
      cancelAnimationFrame(animateId);
    }
  };

  const onClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let context: CanvasRenderingContext2D = canvas.getContext('2d')!;
    let width, height, scale;

    scale = window.devicePixelRatio;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;

    context.scale(scale, scale);

    drawCircles(canvas, context, width, height, circles);

    const animateId = requestAnimationFrame(animate);
    if (false) {
      cancelAnimationFrame(animateId);
    }
  };

  useEffect(() => {
    if (!window) return;

    window.addEventListener('click', onClick);
    window.addEventListener('load', animate);
    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('load', animate);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
