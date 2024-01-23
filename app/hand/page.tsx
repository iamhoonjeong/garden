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
        width: {
          min: window.innerWidth,
          ideal: window.innerWidth,
          max: window.innerWidth,
          exact: window.innerWidth,
        },
        height: {
          min: window.innerHeight,
          ideal: window.innerHeight,
          max: window.innerHeight,
          exact: window.innerHeight,
        },
      },
    };

    videoPlay(video, videoConstraints);

    if (innerWidth < innerHeight) {
      video.style.minHeight = `100%`;
    } else {
      video.style.minWidth = `100%`;
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
