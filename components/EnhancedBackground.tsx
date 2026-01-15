import React, { useEffect, useRef } from 'react';

const EnhancedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const scrollRef = useRef(0);
  const rippleRef = useRef<{ x: number; y: number; age: number; maxAge: number }[]>([]);
  
  // Gradient colors for the cosmic background
  const primaryColor = [0, 238, 255]; // Cyan
  const secondaryColor = [100, 100, 255]; // Blue-purple
  const accentColor = [255, 100, 200]; // Pink

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Constants for the cosmic portal
    const PORTAL_RADIUS = 100; 
    const NUM_PARTICLES = 1800;
    const NUM_STARS = 550;

    interface Particle {
      r: number;
      angle: number;
      baseSpeed: number;
      size: number;
      phase: number;
      z: number;
      opacity: number;
      hue: number;
      saturation: number;
      lightness: number;
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
        const r = PORTAL_RADIUS + 15 + Math.pow(Math.random(), 2.2) * 600;
        const baseSpeed = (0.35 / Math.sqrt(r)) * (0.9 + Math.random() * 0.2);
        
        // Calculate dynamic colors based on position
        const distFactor = r / 700;
        const hue = 180 + (distFactor * 40) + Math.sin(Date.now() * 0.001 + i) * 10;
        const sat = 80 + Math.random() * 20;
        const light = 40 + (distFactor * 30) + Math.random() * 10;
        
        particles.push({
          r,
          angle: Math.random() * Math.PI * 2,
          baseSpeed,
          size: Math.random() * 1.5 + 0.3,
          phase: Math.random() * Math.PI * 2,
          z: (Math.random() - 0.5) * 4,
          opacity: 0.2 + Math.random() * 0.6,
          hue,
          saturation: sat,
          lightness: light
        });
      }

      stars.length = 0;
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1.5,
          size: Math.random() * 1.2,
          alpha: Math.random() * 0.8,
        });
      }
    };

    const spawnFallingStar = () => {
      fallingStars.push({
        x: Math.random() * width * 1.5 - width * 0.25,
        y: -50,
        vx: (Math.random() - 0.5) * 5 + 10, // Faster diagonal
        vy: Math.random() * 6 + 12,
        len: Math.random() * 100 + 50,
        opacity: Math.random() * 0.6 + 0.4,
        active: true
      });
    };

    const draw = () => {
      // Create a more vibrant gradient background
      const gradient = ctx.createRadialGradient(
        width / 2, 
        height / 2, 
        0, 
        width / 2, 
        height / 2, 
        Math.max(width, height)
      );
      gradient.addColorStop(0, 'rgba(10, 10, 30, 1)'); // Deep space
      gradient.addColorStop(0.5, 'rgba(5, 5, 15, 1)'); // Slightly lighter
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); // Black
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Animated Starfield with cosmic glow
      stars.forEach(star => {
        const mx = (mouseRef.current.x - centerX) * 0.004 * star.z;
        const my = (mouseRef.current.y - centerY) * 0.004 * star.z;
        const sy = (star.y + scrollRef.current * 0.02 * star.z) % height;
        const x = (star.x + mx) % width;
        const finalX = x < 0 ? x + width : x;
        const finalY = sy < 0 ? sy + height : sy;
        
        // Twinkling effect
        const twinkle = 0.6 + 0.4 * Math.sin(Date.now() * 0.002 + star.x * 0.01);
        const colorIntensity = star.alpha * twinkle;
        
        // Create star glow
        const starGradient = ctx.createRadialGradient(
          finalX, finalY, 0, 
          finalX, finalY, star.size * 3
        );
        starGradient.addColorStop(0, `rgba(255, 255, 255, ${colorIntensity})`);
        starGradient.addColorStop(0.5, `rgba(180, 220, 255, ${colorIntensity * 0.7})`);
        starGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = starGradient;
        ctx.beginPath();
        ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Enhanced Falling Stars (Shooting Stars)
      if (Math.random() < 0.015) spawnFallingStar(); // Spawn chance per frame

      for (let i = fallingStars.length - 1; i >= 0; i--) {
        const fs = fallingStars[i];
        fs.x += fs.vx;
        fs.y += fs.vy;
        
        // Multi-colored gradient for shooting stars
        const grad = ctx.createLinearGradient(fs.x, fs.y, fs.x - fs.vx * 2, fs.y - fs.vy * 2);
        grad.addColorStop(0, `rgba(255, 200, 100, ${fs.opacity})`);
        grad.addColorStop(0.3, `rgba(255, 100, 200, ${fs.opacity * 0.8})`);
        grad.addColorStop(1, 'rgba(100, 200, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fs.x, fs.y);
        ctx.lineTo(fs.x - fs.vx * 1.8, fs.y - fs.vy * 1.8);
        ctx.stroke();

        if (fs.y > height + 100 || fs.x > width + 100) {
          fallingStars.splice(i, 1);
        }
      }

      // 3. Enhanced Ripples with cosmic colors
      rippleRef.current = rippleRef.current.filter(r => r.age < r.maxAge);
      rippleRef.current.forEach(r => {
        r.age += 1;
        const progress = r.age / r.maxAge;
        const rippleRadius = progress * 800;
        
        // Color-changing ripple
        const hue = (Date.now() * 0.05 + r.x * 0.1) % 360;
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${(1 - progress) * 0.15})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. Enhanced Lensing Ring & Energy Field
      const ringGlow = ctx.createRadialGradient(
        centerX, centerY, 
        PORTAL_RADIUS, 
        centerX, centerY, 
        PORTAL_RADIUS + 150
      );
      ringGlow.addColorStop(0, 'rgba(0, 238, 255, 0.35)');
      ringGlow.addColorStop(0.1, 'rgba(100, 200, 255, 0.15)');
      ringGlow.addColorStop(0.3, 'rgba(150, 150, 255, 0.08)');
      ringGlow.addColorStop(0.6, 'rgba(200, 100, 255, 0.04)');
      ringGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = ringGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, PORTAL_RADIUS + 150, 0, Math.PI * 2);
      ctx.fill();

      // 5. Enhanced Accretion Disk with dynamic colors
      const tilt = 0.22; 
      const scrollSpeedBoost = 1 + (scrollRef.current * 0.0015);

      particles.forEach(p => {
        p.angle += p.baseSpeed * scrollSpeedBoost;
        
        let x = Math.cos(p.angle) * p.r;
        let y = Math.sin(p.angle) * p.r * tilt;

        const mdx = (centerX + x) - mouseRef.current.x;
        const mdy = (centerY + y) - mouseRef.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 350) {
          const mforce = Math.pow((350 - mdist) / 350, 2);
          x -= (mdx / mdist) * mforce * 30;
          y -= (mdy / mdist) * mforce * 30;
        }

        // Velocity-based coloring with enhanced gradients
        const velocityComponent = -Math.sin(p.angle);
        const distFactor = (PORTAL_RADIUS + 50) / p.r;
        
        // Dynamic hue based on position and velocity
        let hue, saturation, lightness;
        if (velocityComponent > 0) {
          hue = p.hue + velocityComponent * 15;
          saturation = p.saturation;
          lightness = p.lightness + (velocityComponent * 35) + (distFactor * 10);
        } else {
          hue = p.hue - Math.abs(velocityComponent) * 15;
          saturation = p.saturation;
          lightness = p.lightness + (Math.abs(velocityComponent) * 10);
        }
        
        const color = `hsla(${hue}, ${saturation}%, ${Math.min(98, lightness)}%, ${p.opacity * (0.8 + velocityComponent * 0.2)})`;

        ctx.fillStyle = color;
        ctx.beginPath();
        const stretchFactor = 1 + Math.pow(distFactor, 3) * 5;
        ctx.ellipse(centerX + x, centerY + y, p.size * stretchFactor, p.size, p.angle, 0, Math.PI * 2);
        ctx.fill();

        p.r -= 0.015; // Slightly faster accretion
        if (p.r < PORTAL_RADIUS) {
          p.r = PORTAL_RADIUS + 600 + Math.random() * 60;
          p.angle = Math.random() * Math.PI * 2;
          
          // Update color properties when particle resets
          const newDistFactor = p.r / 700;
          p.hue = 180 + (newDistFactor * 40) + Math.sin(Date.now() * 0.001 + Math.random() * 100) * 10;
          p.saturation = 80 + Math.random() * 20;
          p.lightness = 40 + (newDistFactor * 30) + Math.random() * 10;
        }
      });

      // 6. Enhanced Singularity with pulsating glow
      ctx.save();
      const pulse = Math.sin(Date.now() * 0.003) * 0.5 + 0.5; // Pulsating effect
      ctx.shadowBlur = 70 + pulse * 30;
      ctx.shadowColor = `rgba(0, 238, 255, ${0.6 + pulse * 0.4})`;
      ctx.fillStyle = '#000011';
      ctx.beginPath();
      ctx.arc(centerX, centerY, PORTAL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner core with additional glow
      ctx.shadowBlur = 40 + pulse * 20;
      ctx.shadowColor = `rgba(100, 200, 255, ${0.4 + pulse * 0.3})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, PORTAL_RADIUS * 0.9, 0, Math.PI * 2);
      ctx.fill();
      
      // Core highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(200, 240, 255, ${0.2 + pulse * 0.1})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, PORTAL_RADIUS * 0.6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      // 7. Enhanced Hawking Radiation with color variations
      if (Math.random() > 0.97) {
        const hA = Math.random() * Math.PI * 2;
        const hR = PORTAL_RADIUS + Math.random() * 10;
        const hue = (Date.now() * 0.1) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 90%)`;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(
          centerX + Math.cos(hA) * hR, 
          centerY + Math.sin(hA) * hR, 
          1.2, 
          0, 
          Math.PI * 2
        );
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
      rippleRef.current.push({ 
        x: e.clientX, 
        y: e.clientY, 
        age: 0, 
        maxAge: 180 // Longer lasting ripples
      });
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
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none"
      style={{ 
        filter: 'contrast(1.3) saturate(1.2) brightness(1.1)',
        background: 'radial-gradient(ellipse at center, rgba(10,10,30,1) 0%, rgba(0,0,0,1) 100%)'
      }}
    />
  );
};

export default EnhancedBackground;