import React, { useEffect, useRef } from 'react';

const EnhancedParticles: React.FC = () => {
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
      hue: number;
      life: number;
      maxLife: number;
    }

    interface Star {
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      baseHue: number;
    }

    interface CosmicRay {
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      trail: { x: number; y: number; age: number }[];
      active: boolean;
      hue: number;
    }

    const particles: Particle[] = [];
    const stars: Star[] = [];
    const cosmicRays: CosmicRay[] = [];
    const NUM_PARTICLES = 120;
    const NUM_STARS = 150;
    const MOUSE_RADIUS = 150; // Increased radius for stronger mouse interaction

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
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2.5 + 0.8,
          opacity: Math.random() * 0.4 + 0.2,
          hue: Math.random() * 60 + 180, // Cyan-blue hues
          life: 0,
          maxLife: Math.random() * 100 + 200
        });
      }

      // Initialize stars with varied colors
      stars.length = 0;
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          twinkleSpeed: Math.random() * 0.003 + 0.001,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseHue: Math.random() * 30 + 180 // Mostly blue/cyan hues
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const spawnCosmicRay = () => {
      if (cosmicRays.length >= 2) return; // Max 2 cosmic rays at once
      
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      
      // Spawn from random edge
      if (side === 0) { // Top
        x = Math.random() * width;
        y = -30;
        vx = (Math.random() - 0.5) * 3;
        vy = Math.random() * 2 + 2;
      } else if (side === 1) { // Right
        x = width + 30;
        y = Math.random() * height;
        vx = -(Math.random() * 2 + 2);
        vy = (Math.random() - 0.5) * 3;
      } else if (side === 2) { // Bottom
        x = Math.random() * width;
        y = height + 30;
        vx = (Math.random() - 0.5) * 3;
        vy = -(Math.random() * 2 + 2);
      } else { // Left
        x = -30;
        y = Math.random() * height;
        vx = Math.random() * 2 + 2;
        vy = (Math.random() - 0.5) * 3;
      }
      
      cosmicRays.push({
        x, y, vx, vy,
        angle: Math.atan2(vy, vx),
        trail: [],
        active: true,
        hue: Math.random() * 120 + 200 // Purple/blue hues
      });
    };

    // Spawn cosmic rays less frequently for better performance
    setInterval(spawnCosmicRay, 12000);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw twinkling stars with enhanced colors
      const time = Date.now() * 0.001;
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 1000 + star.twinkleOffset) * 0.5 + 0.5;
        const opacity = 0.3 + twinkle * 0.5;
        const size = star.size + twinkle * 0.5; // Size also twinkles
        
        // Create colorful star with gradient
        const starGradient = ctx.createRadialGradient(
          star.x, star.y, 0, 
          star.x, star.y, size * 3
        );
        const hue = star.baseHue + twinkle * 20;
        starGradient.addColorStop(0, `hsla(${hue}, 100%, 90%, ${opacity})`);
        starGradient.addColorStop(0.5, `hsla(${hue}, 100%, 70%, ${opacity * 0.7})`);
        starGradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = starGradient;
        ctx.fill();
      });

      // Update and draw particles with enhanced physics
      particles.forEach((p) => {
        // Mouse repulsion effect
        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_RADIUS) {
          // Calculate repulsion force
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          
          // Push particles away from mouse with stronger effect
          p.vx += Math.cos(angle) * force * 1.2;
          p.vy += Math.sin(angle) * force * 1.2;
        }

        // Apply friction to slow down particles over time
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Maintain minimum velocity for ambient movement
        if (Math.abs(p.vx) < 0.08 && Math.abs(p.vy) < 0.08) {
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with smoother transitions
        if (p.x < -p.size * 2) p.x = width + p.size * 2;
        if (p.x > width + p.size * 2) p.x = -p.size * 2;
        if (p.y < -p.size * 2) p.y = height + p.size * 2;
        if (p.y > height + p.size * 2) p.y = -p.size * 2;

        // Life cycle for particles
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.hue = Math.random() * 60 + 180; // Reset color
        }

        // Draw particle with enhanced glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Colorful gradient for soft glow
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0, 
          p.x, p.y, p.size * 3
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 80%, ${p.opacity})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw cosmic rays with vibrant trails
      cosmicRays.forEach((ray, index) => {
        if (!ray.active) return;
        
        // Update position
        ray.x += ray.vx;
        ray.y += ray.vy;
        
        // Add to trail with color variation
        ray.trail.push({ x: ray.x, y: ray.y, age: 0 });
        if (ray.trail.length > 20) ray.trail.shift(); // Longer trail
        
        // Age trail
        ray.trail.forEach(t => t.age++);
        
        // Draw colorful trail (energy wake)
        ray.trail.forEach((t, i) => {
          const progress = i / ray.trail.length;
          const trailOpacity = progress * 0.8;
          const trailSize = (1 - progress) * 4;
          const trailHue = (ray.hue + i * 5) % 360; // Hue shifts along trail
          
          ctx.beginPath();
          ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2);
          
          const trailGradient = ctx.createRadialGradient(
            t.x, t.y, 0, 
            t.x, t.y, trailSize * 2.5
          );
          trailGradient.addColorStop(0, `hsla(${trailHue}, 100%, 70%, ${trailOpacity})`);
          trailGradient.addColorStop(0.5, `hsla(${trailHue + 20}, 100%, 50%, ${trailOpacity * 0.6})`);
          trailGradient.addColorStop(1, `hsla(${trailHue + 40}, 100%, 30%, 0)`);
          
          ctx.fillStyle = trailGradient;
          ctx.fill();
        });
        
        // Draw cosmic ray core
        ctx.save();
        ctx.translate(ray.x, ray.y);
        ctx.rotate(ray.angle);
        
        // Core gradient
        const coreGradient = ctx.createLinearGradient(-6, 0, 10, 0);
        coreGradient.addColorStop(0, `hsla(${ray.hue}, 100%, 90%, 0.9)`);
        coreGradient.addColorStop(0.5, `hsla(${(ray.hue + 30) % 360}, 100%, 95%, 1)`);
        coreGradient.addColorStop(1, `hsla(${(ray.hue + 60) % 360}, 100%, 85%, 0.8)`);
        
        // Draw the ray body
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-6, -4);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-6, 4);
        ctx.closePath();
        
        ctx.fillStyle = coreGradient;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${ray.hue}, 100%, 70%, 0.7)`;
        ctx.strokeStyle = `hsla(${(ray.hue + 20) % 360}, 100%, 80%, 0.8)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.restore();
        
        // Remove if out of bounds
        if (ray.x < -100 || ray.x > width + 100 || ray.y < -100 || ray.y > height + 100) {
          cosmicRays.splice(index, 1);
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
      className="fixed inset-0 w-full h-full pointer-events-none z-[2]"
      style={{ 
        mixBlendMode: 'screen' // Creates interesting blending effects with background
      }}
    />
  );
};

export default EnhancedParticles;