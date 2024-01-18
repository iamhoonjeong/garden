'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    let canvas: HTMLCanvasElement = document.querySelector('#canvas')!;
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

    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(0, 0, 100, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }, []);

  return (
    <div>
      <canvas id="canvas"></canvas>
    </div>
  );
}
