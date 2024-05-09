'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { canvasSizeAdjustment, canvasAnimation, drawingCircles, addCircle } from '@/lib/canvas';
import { Circle } from '@/types/canvas';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let circles: Circle[] = [];
  let cursor = { x: 9999, y: 9999 };

  useEffect(() => {
    if (!window) return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    canvasSizeAdjustment(canvas, context);
    canvasAnimation(canvas, context, cursor, drawingCircles, circles);

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onTouchStart);
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchend', onTouchStart);
    };
  }, []);

  const onTouchStart = () => {
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  const onTouchMove = (e: TouchEvent) => {
    cursor.x = e.touches[0].clientX;
    cursor.y = e.touches[0].clientY;
    addCircle(e, circles);
  };

  const onTouchEnd = () => {
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);

    cursor.x = 9999;
    cursor.y = 9999;
  };

  const onMouseDown = () => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    console.log(e);
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    console.log(cursor.x, cursor.y);
    addCircle(e, circles);
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    cursor.x = 9999;
    cursor.y = 9999;
  };

  return (
    <main className="container">
      <div className="hand-image-container">
        <div className="left-hand-container">
          <Image
            className="left-hand"
            src={`/images/hand.svg`}
            alt={'left-hand image'}
            width="80"
            height="80"
          />
          <p>
            <span>Left Hand</span>
            <br />
            Draw something
          </p>
        </div>
        <div className="right-hand-container">
          <Image
            className="right-hand"
            src={`/images/hand.svg`}
            alt={'right-hand image'}
            width="80"
            height="80"
          />
          <p>
            <span>Right Hand</span>
            <br />
            Erase everything
          </p>
        </div>
      </div>
      <nav className="icons">
        <Link href="https://www.linkedin.com/in/iamhoonjeong" target="_blank">
          <Image src={`/images/linkedin-icon.svg`} alt={'linkedin icon'} width="24" height="24" />
        </Link>
      </nav>
      <canvas ref={canvasRef}></canvas>
    </main>
  );
}
