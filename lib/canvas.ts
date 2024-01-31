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

export const addCircle = async (
  e: MouseEvent | TouchEvent,
  circles: Circle[],
) => {
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
      x: e.offsetX,
      y: e.offsetY,
      ix: e.offsetX,
      iy: e.offsetY,
      ax: 0.1,
      ay: 0.1,
      vx: 0,
      vy: 0,
    });
  }
};

export const detectVideoAnimation = async (
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
      imageGapPercent =
        imageGapPercent + (window.innerHeight - height) / height;
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

        const dd = Math.sqrt((tx - ifx) * (tx - ifx) + (ty - ify) * (ty - ify));

        context.save();
        context.beginPath();
        context.translate(tx, ty);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(ifx, ify);
        context.arc(0, 0, 10, 0, Math.PI * 2);
        context.fill();
        context.restore();

        if (dd < 50) {
          if (hand === 'Left') {
            circles.push({ x: tx, y: ty });
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
    detectVideoAnimation(canvas, context, video, detector, circles),
  );
  if (window.location.pathname !== '/drawing-with-hand') {
    cancelAnimationFrame(animationId);
    detector.dispose();
  }
};
