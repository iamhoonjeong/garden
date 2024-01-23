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
        width: screen.width,
        height: screen.height,
      },
    };

    // if (window.navigator.userAgent.toLowerCase().search('iphone') !== -1) {
    //   videoConstraints = {
    //     audio: false,
    //     video: {
    //       facingMode: 'user',
    //       width: { exact: screen.width },
    //       height: { exact: screen.height },
    //     },
    //   };
    // }

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
