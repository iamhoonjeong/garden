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
        facingMode: 'user',
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    videoPlay(video, videoConstraints);

    if (window.navigator.userAgent.toLowerCase().search('iphone') !== -1) {
      video.style.minWidth = `${window.innerWidth}px`;
      video.style.minHeight = `${window.innerHeight}px`;
      video.style.width = `${window.innerWidth}px`;
      video.style.height = `${window.innerHeight}px`;
      video.style.maxWidth = `${window.innerWidth}px`;
      video.style.maxHeight = `${window.innerHeight}px`;
    }
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
      video.onloadedmetadata = () => {
        video.play();
      };
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
