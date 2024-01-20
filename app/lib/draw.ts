export const drawCircles = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  circles: {
    pos: number;
    vel: number;
  }[],
) => {
  for (let i = 0; i < circles.length; i++) {
    if (circles[i].pos >= width - 50 || circles[i].pos <= 0 + 50) {
      circles[i].vel *= -1;
    }

    context.save();
    context.translate(0, height * 0.5);
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(circles[i].pos, 0, 50, 0, Math.PI * 2);
    context.fill();
    context.restore();

    circles[i].pos = circles[i].pos + circles[i].vel;
  }
};
