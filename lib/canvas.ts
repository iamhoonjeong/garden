import { Circle } from '@/types/canvas';

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
  circles: Circle[],
) => {
  drawingCircles(canvas, context, circles);

  const animateId = requestAnimationFrame(() =>
    canvasAnimation(canvas, context, circles),
  );
  if (false) {
    cancelAnimationFrame(animateId);
  }
};

export const drawingCircles = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  circles: Circle[],
) => {
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  let cw = width * 0.03;

  context.clearRect(0, 0, width, height);

  for (let i = 0; i < circles.length; i++) {
    if (circles[i].pos.x >= width || circles[i].pos.x <= 0) {
      circles[i].vel.x *= -1;
    }
    // if (circles[i].pos.y >= height || circles[i].pos.y <= 0) {
    //   circles[i].vel.y *= -1;
    // }

    context.save();
    context.translate(0, 0);
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(circles[i].pos.x, circles[i].pos.y, cw, 0, Math.PI * 2);
    context.fill();
    context.restore();

    circles[i].pos.x = circles[i].pos.x + circles[i].vel.x;
    // circles[i].pos.y = circles[i].pos.y + circles[i].vel.y;
  }
};

export const addCircle = async (e: MouseEvent, circles: Circle[]) => {
  circles.push({
    pos: {
      x: e.offsetX,
      y: e.offsetY,
    },
    vel: {
      x: 1,
      y: 1,
    },
  });
};
