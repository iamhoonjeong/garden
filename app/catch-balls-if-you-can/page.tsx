'use client';
import { useEffect, useRef, useState } from 'react';
import { HandDetector } from '@tensorflow-models/hand-pose-detection';
import { canvasSizeAdjustment, catchBallsIfYouCanAnimation } from '@/lib/canvas';
import { createTensorflowDetector } from '@/lib/tensorflow';
import { Circle } from '@/types/canvas';

export default function Hand() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<HandDetector>();
  const [time, setTime] = useState(3000);
  const [stopTime, setStopTime] = useState(false);
  const [circleCount, setCircleCount] = useState(12);

  let circles: Circle[] = [];

  const randomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const getDetector = async () => {
    try {
      setDetector(await createTensorflowDetector());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!detector) {
      getDetector();
    }
  }, []);

  useEffect(() => {
    if (!window) return;
    if (!videoRef.current) return;
    if (!canvasRef.current) return;
    if (!detector) return;

    // will change - static radius value in x, y
    for (let i = 0; i < 50; i++) {
      circles.push({
        x: randomNumber(40, window.innerWidth - 40),
        y: randomNumber(40, window.innerHeight - 40),
        ax: 1,
        ay: 1,
        ix: 0,
        iy: 0,
        vx: 0,
        vy: 0,
      });
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    canvasSizeAdjustment(canvas, context);

    let videoConstraints: MediaStreamConstraints = {
      audio: false,
      video: { facingMode: 'user' },
    };

    videoPlay(video, videoConstraints);
    catchBallsIfYouCanAnimation(canvas, context, video, detector, circles);
  }, [detector]);

  const videoPlay = (video: HTMLVideoElement, constraints: MediaStreamConstraints) => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        video.srcObject = mediaStream;
        video.onloadedmetadata = () => {
          video.play();
        };
      })
      .catch((error) => console.error(error));
  };

  return (
    <main className="container">
      <div className="pinch-stop-watch"></div>
      <canvas ref={canvasRef}></canvas>
      <video ref={videoRef} playsInline={true} muted={true}></video>
      <div className="pinch-score">{circleCount}/50</div>
    </main>
  );
}
