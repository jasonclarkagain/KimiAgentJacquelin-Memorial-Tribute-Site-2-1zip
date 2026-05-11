import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacityDelta: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

function getSeason() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

const SEASON_CONFIG = {
  spring: {
    colors: ['#E8B4B8', '#D4A0A4', '#F2C4C8', '#C9909A'],
    count: 28,
    speedY: { min: -0.4, max: -0.15 },
    sway: 0.8,
    sizeRange: [3, 7],
    shape: 'petal' as const,
  },
  summer: {
    colors: ['#C47A1E', '#F0B347', '#E8C87A', '#D4AF37'],
    count: 22,
    speedY: { min: -0.5, max: -0.2 },
    sway: 0.5,
    sizeRange: [2, 5],
    shape: 'spark' as const,
  },
  autumn: {
    colors: ['#C47A1E', '#8B5A2B', '#B85C38', '#D4843A'],
    count: 30,
    speedY: { min: 0.3, max: 0.7 },
    sway: 1.2,
    sizeRange: [4, 9],
    shape: 'leaf' as const,
  },
  winter: {
    colors: ['#B8D4E8', '#D4E8F2', '#E8F4F8', '#A8C8DC'],
    count: 25,
    speedY: { min: 0.2, max: 0.5 },
    sway: 0.4,
    sizeRange: [2, 6],
    shape: 'flake' as const,
  },
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function makeParticle(
  w: number,
  h: number,
  config: typeof SEASON_CONFIG['spring'],
  initialY = false
): Particle {
  return {
    x: rand(0, w),
    y: initialY ? rand(0, h) : (config.speedY.min < 0 ? rand(h, h + 100) : rand(-100, 0)),
    size: rand(config.sizeRange[0], config.sizeRange[1]),
    speedX: rand(-0.15, 0.15),
    speedY: rand(config.speedY.min, config.speedY.max),
    opacity: rand(0.15, 0.45),
    opacityDelta: rand(-0.002, 0.002),
    sway: config.sway,
    swaySpeed: rand(0.005, 0.012),
    swayOffset: rand(0, Math.PI * 2),
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.015, 0.015),
    color: config.colors[Math.floor(rand(0, config.colors.length))],
  };
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  shape: 'petal' | 'spark' | 'leaf' | 'flake',
  t: number
) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
  ctx.fillStyle = p.color;
  ctx.strokeStyle = p.color;

  const sx = p.x + Math.sin(t * p.swaySpeed + p.swayOffset) * p.sway * 20;

  ctx.translate(sx, p.y);
  ctx.rotate(p.rotation);

  if (shape === 'petal') {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'spark') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha *= 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'leaf') {
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
    ctx.fill();
  } else if (shape === 'flake') {
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(p.size, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }
  }

  ctx.restore();
}

export default function SeasonalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const season = getSeason();
    const config = SEASON_CONFIG[season];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(config.count * 0.5) : config.count;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let particles: Particle[] = Array.from({ length: count }, () =>
      makeParticle(w, h, config, true)
    );

    let t = 0;
    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      t++;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.opacity += p.opacityDelta;
        if (p.opacity <= 0.05 || p.opacity >= 0.5) p.opacityDelta *= -1;

        const gone =
          config.speedY.min < 0
            ? p.y < -20
            : p.y > h + 20;

        if (gone) {
          Object.assign(p, makeParticle(w, h, config, false));
        }

        drawParticle(ctx, p, config.shape, t);
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      particles = Array.from({ length: count }, () => makeParticle(w, h, config, true));
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ mixBlendMode: 'multiply', opacity: 0.7 }}
    />
  );
}
