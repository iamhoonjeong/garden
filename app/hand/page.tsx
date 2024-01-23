'use client';
import { useEffect, useRef, useState } from 'react';

export default function Hand() {
  const [state, setState] = useState<any>(null);
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
          width: { exact: screen.width },
          height: { exact: screen.height },
        },
      };
    }

    videoPlay(video, videoConstraints);

    setState(navigator.mediaDevices.getSupportedConstraints());
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
      {state &&
        Object.keys(state).map((key, i) => {
          console.log(state);
          return (
            <div key={i}>
              {key}: {`${state[key]}`}
            </div>
          );
        })}
      <video ref={videoRef} playsInline={true} muted={true}></video>
    </main>
  );
}
