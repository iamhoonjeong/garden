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
          // width: { max: screen.width },
          height: { min: screen.height, ideal: screen.height },
        },
      };
    }

    videoPlay(video, videoConstraints);
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
      <video ref={videoRef} playsInline={true} muted={true}></video>
    </main>
  );
}
