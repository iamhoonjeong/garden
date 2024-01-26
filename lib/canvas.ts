import { Circle, Cursor } from '@/types/canvas';

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
  if (false) {
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

export const reflectVideoAnimation = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
) => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let centerx = 0;
  let centery = 0;

  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);

  if (width > height) {
    width = window.innerWidth;
    height = width * (video.clientHeight / video.clientWidth);
    centerx = 0;
    centery = window.innerHeight - height;
  } else if (width < height) {
    width = height * (video.clientWidth / video.clientHeight);
    height = window.innerHeight;
    centerx = window.innerWidth - width;
    centery = 0;
  }

  context.drawImage(video, centerx * 0.5, centery * 0.5, width, height);
  context.restore();

  const animationId = requestAnimationFrame(() =>
    reflectVideoAnimation(canvas, context, video),
  );
  if (false) {
    cancelAnimationFrame(animationId);
  }
};
