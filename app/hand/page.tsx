'use client';
import { useEffect, useRef } from 'react';
import { canvasSizeAdjustment, reflectVideoAnimation } from '@/lib/canvas';

export default function Hand() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window) return;
    if (!videoRef.current) return;
    if (!canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    canvasSizeAdjustment(canvas, context);

    let videoConstraints: MediaStreamConstraints = {
      audio: false,
      video: { facingMode: 'user' },
    };

    if (window.navigator.userAgent.toLowerCase().search('iphone') !== -1) {
      videoConstraints = {
        audio: false,
        video: { facingMode: 'user' },
      };
    }

    videoPlay(video, videoConstraints);
    reflectVideoAnimation(canvas, context, video);
  }, []);

  const videoPlay = (
    video: HTMLVideoElement,
    constraints: MediaStreamConstraints,
  ) => {
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
