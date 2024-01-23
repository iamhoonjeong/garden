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

  const animateId = requestAnimationFrame(() =>
    canvasAnimation(canvas, context, cursor, drawingFunction, elements),
  );
  if (false) {
    cancelAnimationFrame(animateId);
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