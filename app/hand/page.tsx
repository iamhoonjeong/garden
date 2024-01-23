'use client';
import { useEffect, useRef } from 'react';

export default function Hand() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(window);
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
    window.addEventListener('click', () => videoPlay(video, videoConstraints));
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
