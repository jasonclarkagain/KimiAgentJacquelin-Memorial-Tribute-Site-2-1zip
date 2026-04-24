import { useEffect, useRef } from 'react';

const COLORS = [
  '#FFE87A', '#F9D94E', '#FFD5B0', '#FF9A5C', '#F7704A',
  '#7EC8E3', '#A8D8EA', '#C8EAF5', '#E8B4B4', '#E07A5F',
  '#D4AF37', '#B5E4CA', '#F4A261', '#E9C46A', '#2A9D8F',
];

interface Point {
  x: number;
  y: number;
}

export default function MousePaintEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<Point>({ x: -999, y: -999 });
  const lastMouse = useRef<Point>({ x: -999, y: -999 });
  const colorIndex = useRef(0);
  const frameRef = useRef<number>(0);
  const isMoving = useRef(false);
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const pos = 'touches' in e ? e.touches[0] : e;
      lastMouse.current = { ...mouse.current };
      mouse.current = { x: pos.clientX, y: pos.clientY };
      isMoving.current = true;

      if (moveTimer.current) clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => {
        isMoving.current = false;
      }, 100);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    const draw = () => {
      if (isMoving.current) {
        const dx = mouse.current.x - lastMouse.current.x;
        const dy = mouse.current.y - lastMouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
          const color = COLORS[colorIndex.current % COLORS.length];
          const steps = Math.max(1, Math.floor(dist / 4));

          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = lastMouse.current.x + dx * t;
            const y = lastMouse.current.y + dy * t;

            const speed = Math.min(dist, 40);
            const radius = 6 + speed * 0.4 + Math.random() * 8;

            ctx.save();
            ctx.globalAlpha = 0.18 + Math.random() * 0.18;
            ctx.globalCompositeOperation = 'source-over';

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color + 'CC');
            gradient.addColorStop(1, color + '00');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(
              x + (Math.random() - 0.5) * 6,
              y + (Math.random() - 0.5) * 6,
              radius * (0.7 + Math.random() * 0.6),
              radius * (0.4 + Math.random() * 0.4),
              Math.random() * Math.PI,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
          }

          if (Math.random() < 0.04) {
            colorIndex.current = (colorIndex.current + 1) % COLORS.length;
          }
        }
      }

      ctx.save();
      ctx.globalAlpha = 0.012;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (moveTimer.current) clearTimeout(moveTimer.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
