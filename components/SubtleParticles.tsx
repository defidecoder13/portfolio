
import React, { useEffect, useRef } from 'react';

const SubtleParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const mousePos = { x: -1000, y: -1000 }; // Start off-screen

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }

    interface Star {
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }

    interface Rocket {
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      trail: { x: number; y: number; age: number }[];
      active: boolean;
    }

    const particles: Particle[] = [];
    const stars: Star[] = [];
    const rockets: Rocket[] = [];
    const NUM_PARTICLES = 80;
    const NUM_STARS = 100;
    const MOUSE_RADIUS = 120; // Distance at which particles react to mouse

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles.length = 0;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.3 + 0.2
        });
      }

      // Initialize stars
      stars.length = 0;
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          twinkleSpeed: Math.random() * 0.002 + 0.001,
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const spawnRocket = () => {
      if (rockets.length >= 3) return; // Max 3 rockets at once
      
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      
      // Spawn from random edge
      if (side === 0) { // Top
        x = Math.random() * width;
        y = -20;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 1.5 + 1;
      } else if (side === 1) { // Right
        x = width + 20;
        y = Math.random() * height;
        vx = -(Math.random() * 1.5 + 1);
        vy = (Math.random() - 0.5) * 2;
      } else if (side === 2) { // Bottom
        x = Math.random() * width;
        y = height + 20;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 1.5 + 1);
      } else { // Left
        x = -20;
        y = Math.random() * height;
        vx = Math.random() * 1.5 + 1;
        vy = (Math.random() - 0.5) * 2;
      }
      
      rockets.push({
        x, y, vx, vy,
        angle: Math.atan2(vy, vx),
        trail: [],
        active: true
      });
    };

    setInterval(spawnRocket, 8000); // Spawn rocket every 8 seconds

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw twinkling stars
      const time = Date.now();
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const opacity = 0.3 + twinkle * 0.4;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Star glow
        const starGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
        starGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        starGradient.addColorStop(0.5, `rgba(200, 220, 255, ${opacity * 0.5})`);
        starGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = starGradient;
        ctx.fill();
      });

      particles.forEach((p) => {
        // Mouse repulsion effect
        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_RADIUS) {
          // Calculate repulsion force
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          
          // Push particles away from mouse
          p.vx += Math.cos(angle) * force * 0.8;
          p.vy += Math.sin(angle) * force * 0.8;
        }

        // Apply friction to slow down particles over time
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Maintain minimum velocity for ambient movement
        if (Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1) {
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle with subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Subtle gradient for soft glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(0, 238, 255, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(0, 238, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw rockets
      rockets.forEach((rocket, index) => {
        if (!rocket.active) return;
        
        // Update position
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        
        // Add to trail
        rocket.trail.push({ x: rocket.x, y: rocket.y, age: 0 });
        if (rocket.trail.length > 15) rocket.trail.shift();
        
        // Age trail
        rocket.trail.forEach(t => t.age++);
        
        // Draw trail (exhaust)
        rocket.trail.forEach((t, i) => {
          const progress = i / rocket.trail.length;
          const trailOpacity = progress * 0.6;
          const trailSize = (1 - progress) * 3;
          
          ctx.beginPath();
          ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2);
          
          const trailGradient = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, trailSize * 2);
          trailGradient.addColorStop(0, `rgba(255, 150, 50, ${trailOpacity})`);
          trailGradient.addColorStop(0.5, `rgba(255, 100, 20, ${trailOpacity * 0.5})`);
          trailGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
          
          ctx.fillStyle = trailGradient;
          ctx.fill();
        });
        
        // Draw rocket body
        ctx.save();
        ctx.translate(rocket.x, rocket.y);
        ctx.rotate(rocket.angle);
        
        // Rocket shape
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-4, -3);
        ctx.lineTo(-4, 3);
        ctx.closePath();
        
        const rocketGradient = ctx.createLinearGradient(-4, 0, 8, 0);
        rocketGradient.addColorStop(0, 'rgba(200, 200, 200, 0.9)');
        rocketGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        
        ctx.fillStyle = rocketGradient;
        ctx.fill();
        
        // Rocket glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 238, 255, 0.8)';
        ctx.strokeStyle = 'rgba(0, 238, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        
        // Remove if out of bounds
        if (rocket.x < -50 || rocket.x > width + 50 || rocket.y < -50 || rocket.y > height + 50) {
          rockets.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
};

export default SubtleParticles;
