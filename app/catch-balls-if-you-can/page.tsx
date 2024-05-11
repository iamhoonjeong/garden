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

    if (window.innerWidth < 600) {
      for (let i = 0; i < 30; i++) {
        let radious = randomNumber(20, 60);
        circles.push({
          radious,
          x: randomNumber(radious, window.innerWidth - radious),
          y: randomNumber(radious, window.innerHeight - radious),
          ax: randomNumber(1, 8),
          ay: randomNumber(1, 8),
          ix: 0,
          iy: 0,
          vx: 0,
          vy: 0,
        });
      }
    } else {
      for (let i = 0; i < 30; i++) {
        let radious = randomNumber(60, 120);
        circles.push({
          radious,
          x: randomNumber(radious, window.innerWidth - radious),
          y: randomNumber(radious, window.innerHeight - radious),
          ax: randomNumber(1, 8),
          ay: randomNumber(1, 8),
          ix: 0,
          iy: 0,
          vx: 0,
          vy: 0,
        });
      }
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

  const onResumeBalls = () => {
    circles.splice(0, circles.length);

    if (window.innerWidth < 600) {
      for (let i = 0; i < 30; i++) {
        let radious = randomNumber(20, 60);
        circles.push({
          radious,
          x: randomNumber(radious, window.innerWidth - radious),
          y: randomNumber(radious, window.innerHeight - radious),
          ax: randomNumber(1, 8),
          ay: randomNumber(1, 8),
          ix: 0,
          iy: 0,
          vx: 0,
          vy: 0,
        });
      }
    } else {
      for (let i = 0; i < 30; i++) {
        let radious = randomNumber(60, 120);
        circles.push({
          radious,
          x: randomNumber(radious, window.innerWidth - radious),
          y: randomNumber(radious, window.innerHeight - radious),
          ax: randomNumber(1, 8),
          ay: randomNumber(1, 8),
          ix: 0,
          iy: 0,
          vx: 0,
          vy: 0,
        });
      }
    }
  };

  return (
    <main className="container">
      <div className="pinch-stop-watch"></div>
      <div className="resume" onClick={onResumeBalls}>
        Resume Balls
      </div>
      <canvas ref={canvasRef}></canvas>
      <video ref={videoRef} playsInline={true} muted={true}></video>
    </main>
  );
}
