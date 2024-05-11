import { Circle, Cursor } from '@/types/canvas';
import { Hand, HandDetector } from '@tensorflow-models/hand-pose-detection';

export const canvasSizeAdjustment = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
) => {
  let width, height, scale;

  scale = window.devicePixelRatio;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;

  context.scale(scale, scale);
};

export const canvasAnimation = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  cursor: Cursor,
  drawingFunction: any,
  elements: any,
) => {
  drawingFunction(canvas, context, cursor, elements);

  const animationId = requestAnimationFrame(() =>
    canvasAnimation(canvas, context, cursor, drawingFunction, elements),
  );
  if (window.location.pathname !== '/') {
    cancelAnimationFrame(animationId);
  }
};

export const drawingCircles = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  cursor: Cursor,
  circles: Circle[],
) => {
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  let cw = width * 0.03;

  context.clearRect(0, 0, width, height);

  let dx, dy, dd;

  for (let i = 0; i < circles.length; i++) {
    dx = circles[i].x - cursor.x;
    dy = circles[i].y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    if (dd < 100) {
      circles[i].vx += circles[i].ax;
    }

    if (circles[i].x >= width || circles[i].x <= 0) {
      circles[i].vx *= -1;
    }

    context.save();
    context.translate(0, 0);
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(circles[i].x, circles[i].y, cw, 0, Math.PI * 2);
    context.fill();
    context.restore();

    circles[i].x += circles[i].vx;
  }
};

export const addCircle = async (e: MouseEvent | TouchEvent, circles: Circle[]) => {
  if (e instanceof TouchEvent) {
    circles.push({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      ix: e.touches[0].clientX,
      iy: e.touches[0].clientY,
      ax: 0.1,
      ay: 0.1,
      vx: 0,
      vy: 0,
    });
  } else {
    circles.push({
      x: e.clientX,
      y: e.clientY,
      ix: e.clientX,
      iy: e.clientY,
      ax: 0.1,
      ay: 0.1,
      vx: 0,
      vy: 0,
    });
  }
};

export const catchBallsIfYouCanAnimation = async (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  detector: HandDetector,
  circles: Circle[],
) => {
  if (!detector) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let deviceRatio = window.devicePixelRatio;
  let imageGapPercent = 1;
  let gapx = 0;
  let gapy = 0;

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);

  if (width > height) {
    width = window.innerWidth;
    height = width * (video.clientHeight / video.clientWidth);

    if (height < window.innerHeight) {
      imageGapPercent = imageGapPercent + (window.innerHeight - height) / height;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  } else if (width < height) {
    width = height * (video.clientWidth / video.clientHeight);
    height = window.innerHeight;

    if (width < window.innerWidth) {
      imageGapPercent = imageGapPercent + (window.innerWidth - width) / width;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  }

  gapx = window.innerWidth - width;
  gapy = window.innerHeight - height;

  context.drawImage(video, gapx * 0.5, gapy * 0.5, width, height);
  context.restore();

  let hands: Hand[];
  try {
    hands = await detector.estimateHands(canvas);
    if (hands.length) {
      for (let i = 0; i < hands.length; i++) {
        const hand = hands[i].handedness;
        const thumb = hands[i].keypoints[4];
        const indexFinger = hands[i].keypoints[8];

        const tx = thumb.x / deviceRatio;
        const ty = thumb.y / deviceRatio;
        const ifx = indexFinger.x / deviceRatio;
        const ify = indexFinger.y / deviceRatio;
        const centerx = tx < ifx ? tx + (ifx - tx) / 2 : ifx + (tx - ifx) / 2;
        const centery = ty < ify ? ty + (ify - ty) / 2 : ify + (ty - ify) / 2;

        const dd = Math.sqrt((tx - ifx) * (tx - ifx) + (ty - ify) * (ty - ify));

        context.save();
        context.beginPath();
        context.translate(tx, ty);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        // context.save();
        // context.beginPath();
        // context.translate(centerx, centery);
        // context.arc(0, 0, 10, 0, Math.PI * 2);
        // context.fill();
        // context.restore();

        context.save();
        context.beginPath();
        context.translate(ifx, ify);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        if (dd < 50) {
          if (hand === 'Left') {
            for (let i = 0; i < circles.length; i++) {
              const dd = Math.sqrt(
                (circles[i].x - centerx) * (circles[i].x - centerx) +
                  (circles[i].y - centery) * (circles[i].y - centery),
              );
              if (dd < 50) {
                circles.splice(i, 1);
              }
            }
          } else if (hand === 'Right') {
            circles.splice(0, circles.length);
          }
        }
      }
    }

    for (let i = 0; i < circles.length; i++) {
      let color = '';
      if (i % 7 === 0) {
        color = '#ed0100';
      } else if (i % 7 === 1) {
        color = '#ec8601';
      } else if (i % 7 === 2) {
        color = '#f4ea02';
      } else if (i % 7 === 3) {
        color = '#1ee700';
      } else if (i % 7 === 4) {
        color = '#2100e4';
      } else if (i % 7 === 5) {
        color = '#a400e1';
      } else if (i % 7 === 6) {
        color = '#c07bff';
      }

      context.save();
      context.translate(circles[i].x, circles[i].y);
      context.beginPath();
      context.arc(0, 0, circles[i].radious ?? 20, 0, Math.PI * 2);
      context.globalAlpha = 0.9;

      context.fillStyle = color;
      context.fill();
      context.restore();

      // moving
      circles[i].x += circles[i].ax;
      circles[i].y += circles[i].ay;

      if (
        circles[i].x >= window.innerWidth - (circles[i].radious ?? 20) ||
        circles[i].x <= 0 + (circles[i].radious ?? 20)
      )
        circles[i].ax *= -1;
      if (
        circles[i].y >= window.innerHeight - (circles[i].radious ?? 20) ||
        circles[i].y <= 0 + (circles[i].radious ?? 20)
      )
        circles[i].ay *= -1;
    }
  } catch (error) {
    detector.dispose();
    console.error(error);
  }

  const animationId = requestAnimationFrame(() =>
    catchBallsIfYouCanAnimation(canvas, context, video, detector, circles),
  );
  if (window.location.pathname !== '/catch-balls-if-you-can') {
    cancelAnimationFrame(animationId);
    detector.dispose();
  }
};

export const drawingWithHandAnimation = async (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  detector: HandDetector,
  circles: { x: number; y: number }[],
) => {
  if (!detector) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let deviceRatio = window.devicePixelRatio;
  let imageGapPercent = 1;
  let gapx = 0;
  let gapy = 0;

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);

  if (width > height) {
    width = window.innerWidth;
    height = width * (video.clientHeight / video.clientWidth);

    if (height < window.innerHeight) {
      imageGapPercent = imageGapPercent + (window.innerHeight - height) / height;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  } else if (width < height) {
    width = height * (video.clientWidth / video.clientHeight);
    height = window.innerHeight;

    if (width < window.innerWidth) {
      imageGapPercent = imageGapPercent + (window.innerWidth - width) / width;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  }

  gapx = window.innerWidth - width;
  gapy = window.innerHeight - height;

  context.drawImage(video, gapx * 0.5, gapy * 0.5, width, height);
  context.restore();

  let hands: Hand[];
  try {
    hands = await detector.estimateHands(canvas);
    if (hands.length) {
      for (let i = 0; i < hands.length; i++) {
        const hand = hands[i].handedness;
        const thumb = hands[i].keypoints[4];
        const indexFinger = hands[i].keypoints[8];

        const tx = thumb.x / deviceRatio;
        const ty = thumb.y / deviceRatio;
        const ifx = indexFinger.x / deviceRatio;
        const ify = indexFinger.y / deviceRatio;
        const centerx = tx < ifx ? tx + (ifx - tx) / 2 : ifx + (tx - ifx) / 2;
        const centery = ty < ify ? ty + (ify - ty) / 2 : ify + (ty - ify) / 2;

        const dd = Math.sqrt((tx - ifx) * (tx - ifx) + (ty - ify) * (ty - ify));

        context.save();
        context.beginPath();
        context.translate(tx, ty);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(ifx, ify);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        if (dd < 50) {
          if (hand === 'Left') {
            circles.push({ x: centerx, y: centery });
          } else if (hand === 'Right') {
            circles = [];
          }
        }
      }
    }

    for (let i = 0; i < circles.length; i++) {
      context.save();
      context.translate(circles[i].x, circles[i].y);
      context.beginPath();
      context.arc(0, 0, 20, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  } catch (error) {
    detector.dispose();
    console.error(error);
  }

  const animationId = requestAnimationFrame(() =>
    drawingWithHandAnimation(canvas, context, video, detector, circles),
  );
  if (window.location.pathname !== '/drawing-with-hand') {
    cancelAnimationFrame(animationId);
    detector.dispose();
  }
};

export const shakingRainbowsAnimation = async (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  detector: HandDetector,
  circles: { x: number; y: number; color: string }[],
  allowClick: boolean,
) => {
  if (!detector) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let deviceRatio = window.devicePixelRatio;
  let imageGapPercent = 1;
  let gapx = 0;
  let gapy = 0;

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);

  if (width > height) {
    width = window.innerWidth;
    height = width * (video.clientHeight / video.clientWidth);

    if (height < window.innerHeight) {
      imageGapPercent = imageGapPercent + (window.innerHeight - height) / height;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  } else if (width < height) {
    width = height * (video.clientWidth / video.clientHeight);
    height = window.innerHeight;

    if (width < window.innerWidth) {
      imageGapPercent = imageGapPercent + (window.innerWidth - width) / width;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  }

  gapx = window.innerWidth - width;
  gapy = window.innerHeight - height;

  context.drawImage(video, gapx * 0.5, gapy * 0.5, width, height);
  context.restore();

  let hands: Hand[];
  try {
    hands = await detector.estimateHands(canvas);
    if (hands.length) {
      for (let i = 0; i < hands.length; i++) {
        const hand = hands[i].handedness;
        const thumb = hands[i].keypoints[4];
        const indexFinger = hands[i].keypoints[8];

        const tx = thumb.x / deviceRatio;
        const ty = thumb.y / deviceRatio;
        const ifx = indexFinger.x / deviceRatio;
        const ify = indexFinger.y / deviceRatio;
        const centerx = tx < ifx ? tx + (ifx - tx) / 2 : ifx + (tx - ifx) / 2;
        const centery = ty < ify ? ty + (ify - ty) / 2 : ify + (ty - ify) / 2;

        const dd = Math.sqrt((tx - ifx) * (tx - ifx) + (ty - ify) * (ty - ify));

        context.save();
        context.beginPath();
        context.translate(tx, ty);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        context.arc(0, 0, 5, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(ifx, ify);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        if (dd < 50) {
          if (hand === 'Left' && allowClick) {
            let color = '';
            if (circles.length % 7 === 0) {
              color = '#ed0100';
            } else if (circles.length % 7 === 1) {
              color = '#ec8601';
            } else if (circles.length % 7 === 2) {
              color = '#f4ea02';
            } else if (circles.length % 7 === 3) {
              color = '#1ee700';
            } else if (circles.length % 7 === 4) {
              color = '#2100e4';
            } else if (circles.length % 7 === 5) {
              color = '#a400e1';
            } else if (circles.length % 7 === 6) {
              color = '#c07bff';
            }
            circles.push({ x: centerx, y: centery, color });

            allowClick = false;
          } else if (hand === 'Right') {
            circles = [];
          }
        } else {
          allowClick = true;
        }
      }
    }

    if (circles.length === 1) {
      context.save();
      context.beginPath();
      context.translate(0, 0);
      context.arc(circles[0].x, circles[0].y, 15, 0, Math.PI * 2);
      context.fillStyle = '#ed0100';
      context.fill();
      context.restore();
    }

    for (let i = 1; i < circles.length; i++) {
      const previous = circles[i - 1];
      const current = circles[i];
      context.save();
      context.translate(0, 0);
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.quadraticCurveTo(
        previous.x + Math.abs(previous.x - current.x) / 2,
        previous.y + Math.abs(previous.y - current.y) / 2 - Math.random() * 120,
        current.x,
        current.y,
      );

      const gradient = context.createLinearGradient(previous.x, previous.y, current.x, current.y);
      gradient.addColorStop(0, previous.color);
      gradient.addColorStop(1, current.color);
      context.strokeStyle = gradient;
      context.lineWidth = 30;
      context.lineCap = 'round';

      context.stroke();
      context.restore();
    }
  } catch (error) {
    detector.dispose();
    console.error(error);
  }

  const animationId = requestAnimationFrame(() =>
    shakingRainbowsAnimation(canvas, context, video, detector, circles, allowClick),
  );
  if (window.location.pathname !== '/shaking-rainbows') {
    cancelAnimationFrame(animationId);
    detector.dispose();
  }
};

export const bubbleBubbleAnimation = async (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  detector: HandDetector,
  circles: { size: number; x: number; y: number; accx: number; accy: number; angle: number }[],
) => {
  if (!detector) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let deviceRatio = window.devicePixelRatio;
  let imageGapPercent = 1;
  let gapx = 0;
  let gapy = 0;

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);

  if (width > height) {
    width = window.innerWidth;
    height = width * (video.clientHeight / video.clientWidth);

    if (height < window.innerHeight) {
      imageGapPercent = imageGapPercent + (window.innerHeight - height) / height;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  } else if (width < height) {
    width = height * (video.clientWidth / video.clientHeight);
    height = window.innerHeight;

    if (width < window.innerWidth) {
      imageGapPercent = imageGapPercent + (window.innerWidth - width) / width;
      width = width * imageGapPercent;
      height = height * imageGapPercent;
    }
  }

  gapx = window.innerWidth - width;
  gapy = window.innerHeight - height;

  context.drawImage(video, gapx * 0.5, gapy * 0.5, width, height);
  context.restore();

  let hands: Hand[];
  try {
    hands = await detector.estimateHands(canvas);
    if (hands.length) {
      for (let i = 0; i < hands.length; i++) {
        const hand = hands[i].handedness;
        const thumb = hands[i].keypoints[4];
        const indexFinger = hands[i].keypoints[8];

        const tx = thumb.x / deviceRatio;
        const ty = thumb.y / deviceRatio;
        const ifx = indexFinger.x / deviceRatio;
        const ify = indexFinger.y / deviceRatio;
        const centerx = tx < ifx ? tx + (ifx - tx) / 2 : ifx + (tx - ifx) / 2;
        const centery = ty < ify ? ty + (ify - ty) / 2 : ify + (ty - ify) / 2;

        const dd = Math.sqrt((tx - ifx) * (tx - ifx) + (ty - ify) * (ty - ify));

        context.save();
        context.beginPath();
        context.translate(tx, ty);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        context.arc(0, 0, 5, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(ifx, ify);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        if (dd < 50) {
          if (hand === 'Left') {
            circles.push({
              size: Math.random() * 40 + 20,
              x: centerx,
              y: centery,
              accx: Math.random() * 500 + 1,
              accy: Math.random() * 3 + 1,
              angle: Math.random() * 360,
            });
          } else if (hand === 'Right') {
            circles = [];
          }
        }
      }
    }

    for (let i = 0; i < circles.length; i++) {
      context.save();
      context.translate(circles[i].x, circles[i].y);
      context.beginPath();

      context.arc(0, 0, circles[i].size, 0, Math.PI * 2);
      context.rotate((circles[i].angle * Math.PI) / 180);
      context.strokeStyle = 'red';
      context.lineWidth = 30;
      context.lineCap = 'round';

      const gradient = context.createRadialGradient(
        circles[i].size / 2,
        circles[i].size / 2,
        circles[i].size / 2,
        circles[i].size,
        circles[i].size,
        circles[i].size * 2,
      );
      gradient.addColorStop(0, '#9EADFE');
      gradient.addColorStop(1, '#3F20FF');
      context.globalAlpha = 0.8;
      context.fillStyle = gradient;
      context.fill();
      circles[i].angle += 0.5;

      circles[i].x += Math.sin(3 * circles[i].accx);
      circles[i].y -= circles[i].accy;
      context.restore();
    }
  } catch (error) {
    detector.dispose();
    console.error(error);
  }

  const animationId = requestAnimationFrame(() =>
    bubbleBubbleAnimation(canvas, context, video, detector, circles),
  );
  if (window.location.pathname !== '/bubble-bubble') {
    cancelAnimationFrame(animationId);
    detector.dispose();
  }
};
