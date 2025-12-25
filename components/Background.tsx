
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const scrollRef = useRef(0);
  const rippleRef = useRef<{ x: number; y: number; age: number; maxAge: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Constants for the Portal
    const BH_RADIUS = 85; 
    const NUM_PARTICLES = 1600;
    const NUM_STARS = 450;

    interface Particle {
      r: number;
      angle: number;
      baseSpeed: number;
      size: number;
      phase: number;
      z: number;
      opacity: number;
    }

    interface FallingStar {
      x: number;
      y: number;
      vx: number;
      vy: number;
      len: number;
      opacity: number;
      active: boolean;
    }

    const particles: Particle[] = [];
    const stars: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
    const fallingStars: FallingStar[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles.length = 0;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const r = BH_RADIUS + 12 + Math.pow(Math.random(), 2.2) * 500;
        const baseSpeed = (0.35 / Math.sqrt(r)) * (0.9 + Math.random() * 0.2);
        
        particles.push({
          r,
          angle: Math.random() * Math.PI * 2,
          baseSpeed,
          size: Math.random() * 1.3 + 0.2,
          phase: Math.random() * Math.PI * 2,
          z: (Math.random() - 0.5) * 4,
          opacity: 0.15 + Math.random() * 0.7
        });
      }

      stars.length = 0;
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1.5,
          size: Math.random() * 1.0,
          alpha: Math.random() * 0.7,
        });
      }
    };

    const spawnFallingStar = () => {
      fallingStars.push({
        x: Math.random() * width * 1.5 - width * 0.25,
        y: -50,
        vx: (Math.random() - 0.5) * 4 + 8, // Fast diagonal
        vy: Math.random() * 5 + 10,
        len: Math.random() * 80 + 40,
        opacity: Math.random() * 0.5 + 0.5,
        active: true
      });
    };

    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Static Starfield
      stars.forEach(star => {
        const mx = (mouseRef.current.x - centerX) * 0.004 * star.z;
        const my = (mouseRef.current.y - centerY) * 0.004 * star.z;
        const sy = (star.y + scrollRef.current * 0.02 * star.z) % height;
        const x = (star.x + mx) % width;
        const finalX = x < 0 ? x + width : x;
        const finalY = sy < 0 ? sy + height : sy;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.3 + Math.sin(Date.now() * 0.001 + star.x) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Falling Stars (Shooting Stars)
      if (Math.random() < 0.02) spawnFallingStar(); // Spawn chance per frame

      for (let i = fallingStars.length - 1; i >= 0; i--) {
        const fs = fallingStars[i];
        fs.x += fs.vx;
        fs.y += fs.vy;
        
        const grad = ctx.createLinearGradient(fs.x, fs.y, fs.x - fs.vx * 2, fs.y - fs.vy * 2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${fs.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(fs.x, fs.y);
        ctx.lineTo(fs.x - fs.vx * 1.5, fs.y - fs.vy * 1.5);
        ctx.stroke();

        if (fs.y > height + 100 || fs.x > width + 100) {
          fallingStars.splice(i, 1);
        }
      }

      // 3. Ripples
      rippleRef.current = rippleRef.current.filter(r => r.age < r.maxAge);
      rippleRef.current.forEach(r => {
        r.age += 1;
        const progress = r.age / r.maxAge;
        ctx.strokeStyle = `rgba(0, 238, 255, ${(1 - progress) * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, progress * 700, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. Lensing Ring & Photon Sphere
      const ringGlow = ctx.createRadialGradient(centerX, centerY, BH_RADIUS, centerX, centerY, BH_RADIUS + 120);
      ringGlow.addColorStop(0, 'rgba(0, 238, 255, 0.25)');
      ringGlow.addColorStop(0.1, 'rgba(0, 238, 255, 0.08)');
      ringGlow.addColorStop(0.4, 'rgba(0, 238, 255, 0.02)');
      ringGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ringGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, BH_RADIUS + 120, 0, Math.PI * 2);
      ctx.fill();

      // 5. Accretion Disk
      const tilt = 0.22; 
      const scrollSpeedBoost = 1 + (scrollRef.current * 0.0012);

      particles.forEach(p => {
        p.angle += p.baseSpeed * scrollSpeedBoost;
        
        let x = Math.cos(p.angle) * p.r;
        let y = Math.sin(p.angle) * p.r * tilt;

        const mdx = (centerX + x) - mouseRef.current.x;
        const mdy = (centerY + y) - mouseRef.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 300) {
          const mforce = Math.pow((300 - mdist) / 300, 2);
          x -= (mdx / mdist) * mforce * 25;
          y -= (mdy / mdist) * mforce * 25;
        }

        const velocityComponent = -Math.sin(p.angle);
        const distFactor = (BH_RADIUS + 50) / p.r;
        
        let color;
        if (velocityComponent > 0) {
          const blueHue = 180 + velocityComponent * 15;
          const lightness = 55 + (velocityComponent * 35) + (distFactor * 10);
          color = `hsla(${blueHue}, 100%, ${Math.min(98, lightness)}%, ${p.opacity * (0.8 + velocityComponent * 0.2)})`;
        } else {
          const redHue = 15 - Math.abs(velocityComponent) * 15;
          const lightness = 40 + (Math.abs(velocityComponent) * 10);
          color = `hsla(${redHue}, 100%, ${lightness}%, ${p.opacity * (0.5 + velocityComponent * 0.3)})`;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        const stretchFactor = 1 + Math.pow(distFactor, 3) * 4;
        ctx.ellipse(centerX + x, centerY + y, p.size * stretchFactor, p.size, p.angle, 0, Math.PI * 2);
        ctx.fill();

        p.r -= 0.012;
        if (p.r < BH_RADIUS) {
          p.r = BH_RADIUS + 500 + Math.random() * 50;
          p.angle = Math.random() * Math.PI * 2;
        }
      });

      // 6. The Singularity
      ctx.save();
      ctx.shadowBlur = 50;
      ctx.shadowColor = 'rgba(0, 238, 255, 0.5)';
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(centerX, centerY, BH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(centerX, centerY, BH_RADIUS * 0.96, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Hawking Radiation
      if (Math.random() > 0.98) {
        const hA = Math.random() * Math.PI * 2;
        const hR = BH_RADIUS + Math.random() * 8;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(hA) * hR, centerY + Math.sin(hA) * hR, 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.vx = e.clientX - mouseRef.current.x;
      mouseRef.current.vy = e.clientY - mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const handleClick = (e: MouseEvent) => {
      rippleRef.current.push({ x: e.clientX, y: e.clientY, age: 0, maxAge: 160 });
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);

    init();
    draw();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ filter: 'contrast(1.25) saturate(1.1)' }}
    />
  );
};

export default Background;
