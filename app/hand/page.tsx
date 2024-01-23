'use client';
import { useEffect, useRef, useState } from 'react';

export default function Hand() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!window) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    const videoConstraints: MediaStreamConstraints = {
      audio: false,
      video: {
        width: window.innerWidth,
        height: window.innerHeight,
        facingMode: 'user',
      },
    };

    videoPlay(video, videoConstraints);

    video.style.width = `${window.innerWidth}px`;
    video.style.height = `${window.innerHeight}px`;
  }, []);

  const videoPlay = async (
    video: HTMLVideoElement,
    constraints: MediaStreamConstraints,
  ) => {
    const stream = await window.navigator.mediaDevices.getUserMedia(
      constraints,
    );

    try {
      video.srcObject = stream;

      await new Promise((resolve: any) => {
        video.onloadedmetadata = () => {
          resolve(video);
        };
      });

      video.play();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="container">
      <video
        ref={videoRef}
        autoPlay={true}
        playsInline={true}
        muted={true}
      ></video>
    </main>
  );
}
