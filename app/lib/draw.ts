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
    pos: number;
    vel: number;
  }[],
) => {
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  let cw = width * 0.03;

  context.clearRect(0, 0, width, height);

  for (let i = 0; i < circles.length; i++) {
    if (circles[i].pos >= width || circles[i].pos <= 0) {
      circles[i].vel *= -1;
    }

    context.save();
    context.translate(0, height * 0.5);
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(circles[i].pos, 0, cw, 0, Math.PI * 2);
    context.fill();
    context.restore();

    circles[i].pos = circles[i].pos + circles[i].vel;
  }
};

export const addCircle = (
  e: MouseEvent,
  circles: { pos: number; vel: number }[],
) => {
  circles.push({
    pos: e.offsetX,
    vel: 1,
  });
};
