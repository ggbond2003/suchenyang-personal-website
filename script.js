const canvas = document.querySelector("#signature-field");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let points = [];
let frame = 0;

function resize() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const count = Math.max(22, Math.floor((width * height) / 46000));
  points = Array.from({ length: count }, (_, index) => ({
    x: (width * ((index * 37) % 100)) / 100,
    y: (height * ((index * 53) % 100)) / 100,
    r: 16 + ((index * 11) % 26),
    speed: 0.002 + ((index % 6) * 0.00035),
    phase: index * 0.7,
  }));
}

function draw() {
  frame += 1;
  ctx.clearRect(0, 0, width, height);

  for (const point of points) {
    const driftX = Math.cos(frame * point.speed + point.phase) * 18;
    const driftY = Math.sin(frame * point.speed * 1.4 + point.phase) * 14;
    const x = point.x + driftX;
    const y = point.y + driftY;

    ctx.beginPath();
    ctx.arc(x, y, point.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(47, 125, 104, 0.05)";
    ctx.fill();
  }

  ctx.lineWidth = 1;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const ax = a.x + Math.cos(frame * a.speed + a.phase) * 18;
      const ay = a.y + Math.sin(frame * a.speed * 1.4 + a.phase) * 14;
      const bx = b.x + Math.cos(frame * b.speed + b.phase) * 18;
      const by = b.y + Math.sin(frame * b.speed * 1.4 + b.phase) * 14;
      const distance = Math.hypot(ax - bx, ay - by);

      if (distance < 168) {
        ctx.globalAlpha = (1 - distance / 168) * 0.24;
        ctx.strokeStyle = i % 3 === 0 ? "#b64d45" : "#2e6f95";
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();
