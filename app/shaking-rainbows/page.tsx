'use client';
import { useEffect, useRef, useState } from 'react';
import { HandDetector } from '@tensorflow-models/hand-pose-detection';
import { canvasSizeAdjustment, shakingRainbowsAnimation } from '@/lib/canvas';
import { createTensorflowDetector } from '@/lib/tensorflow';

export default function Hand() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<HandDetector>();

  let circles: { x: number; y: number; color: string }[] = [];
  let allowClick = true;

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

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    canvasSizeAdjustment(canvas, context);

    let videoConstraints: MediaStreamConstraints = {
      audio: false,
      video: { facingMode: 'user' },
    };

    videoPlay(video, videoConstraints);
    shakingRainbowsAnimation(canvas, context, video, detector, circles, allowClick);
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
      <canvas ref={canvasRef}></canvas>
      <video ref={videoRef} playsInline={true} muted={true}></video>
    </main>
  );
}
