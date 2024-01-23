'use client';
import { useEffect, useRef, useState } from 'react';

export default function Hand() {
  const [state, setState] = useState<any>({
    width: 0,
    height: 0,
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!window) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    const videoConstraints: MediaStreamConstraints = {
      audio: false,
      video: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        facingMode: 'user',
      },
    };

    videoPlay(video, videoConstraints);
    setState({
      width: document.documentElement.clientWidth,
      height: window.innerHeight,
    });
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
      <div>{state.width}</div>
      <div>{state.height}</div>
      <video
        ref={videoRef}
        autoPlay={true}
        playsInline={true}
        muted={true}
      ></video>
    </main>
  );
}
