'use client';
import { useEffect, useRef } from 'react';

export default function Hand() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!window) return;
    if (!videoRef.current) return;

    const video = videoRef.current;

    let videoConstraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: 'user',
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    if (window.navigator.userAgent.toLowerCase().search('iphone') !== -1) {
      videoConstraints = {
        audio: false,
        video: {
          facingMode: 'user',
          width: screen.width,
          height: screen.height,
        },
      };
    }

    videoPlay(video, videoConstraints);
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
