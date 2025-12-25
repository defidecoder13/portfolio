
import React, { useEffect, useRef } from 'react';

const NeonParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      trail: { x: number; y: number }[];
    }

    const particles: Particle[] = [];
    const NUM_PARTICLES = 150;
    const MAX_TRAIL_LENGTH = 8;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles.length = 0;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(createParticle());
      }
    };

    const createParticle = (x?: number, y?: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      
      return {
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        hue: 180 + Math.random() * 20, // Cyan to blue range
        trail: []
      };
    };

    const draw = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, index) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Add current position to trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > MAX_TRAIL_LENGTH) {
          p.trail.shift();
        }

        // Wrap around edges with slight randomization
        if (p.x < -10) {
          p.x = width + 10;
          p.y = Math.random() * height;
        }
        if (p.x > width + 10) {
          p.x = -10;
          p.y = Math.random() * height;
        }
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        // Draw trail
        p.trail.forEach((point, i) => {
          const trailOpacity = (i / p.trail.length) * p.opacity * 0.3;
          const trailSize = (i / p.trail.length) * p.size * 0.5;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${trailOpacity})`;
          ctx.fill();
        });

        // Draw main particle with glow
        ctx.save();
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.opacity * 0.4})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.1})`);
        gradient.addColorStop(1, 'rgba(0, 238, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 1)`;
        ctx.fill();
        
        ctx.restore();

        // Connect nearby particles with neon lines
        particles.slice(index + 1).forEach(other => {
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const lineOpacity = (1 - distance / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 238, 255, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Subtle velocity changes for organic movement
        if (Math.random() < 0.02) {
          p.vx += (Math.random() - 0.5) * 0.2;
          p.vy += (Math.random() - 0.5) * 0.2;
          
          // Limit speed
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 3) {
            p.vx = (p.vx / speed) * 3;
            p.vy = (p.vy / speed) * 3;
          }
        }

        // Pulsing opacity
        p.opacity += Math.sin(Date.now() * 0.001 + index) * 0.003;
        p.opacity = Math.max(0.2, Math.min(1, p.opacity));
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default NeonParticles;
