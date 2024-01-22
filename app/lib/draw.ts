import axios from 'axios';

export const initCanvas = (
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

export const drawCircles = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  circles: {
    pos: {
      x: number;
      y: number;
    };
    vel: number;
  }[],
) => {
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  let cw = width * 0.03;

  context.clearRect(0, 0, width, height);

  for (let i = 0; i < circles.length; i++) {
    if (circles[i].pos.x >= width || circles[i].pos.x <= 0) {
      circles[i].vel *= -1;
    }

    context.save();
    context.translate(0, 0);
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(circles[i].pos.x, circles[i].pos.y, cw, 0, Math.PI * 2);
    context.fill();
    context.restore();

    circles[i].pos.x = circles[i].pos.x + circles[i].vel;
  }
};

export const addCircle = async (
  e: MouseEvent,
  circles: { pos: { x: number; y: number }; vel: number }[],
) => {
  circles.push({
    pos: {
      x: e.offsetX,
      y: e.offsetY,
    },
    vel: 1,
  });
};
