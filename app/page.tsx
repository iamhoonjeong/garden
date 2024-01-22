'use client';
import { useRef, useEffect } from 'react';
import { initCanvas, drawCircles, addCircle } from './lib/draw';
import io from 'socket.io-client';
import axios from 'axios';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let circles: { pos: { x: number; y: number }; vel: number }[] = [];
  let socket;

  const connectSocket = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('Connected');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    socket.on(
      'circles',
      (circle: { pos: { x: number; y: number }; vel: number }[]) => {
        circles = circle;
      },
    );

    circles = (await axios.get('/api/circle')).data;
  };

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
    if (!window) return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    connectSocket();
    initCanvas(canvas, context);
    animate(canvas, context);

    window.addEventListener('mousedown', (e) => addCircle(e));
    return () => {
      window.removeEventListener('mousedown', (e) => addCircle(e));
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
