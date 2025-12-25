
import React, { useState, useRef, useEffect } from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';

const Contact: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isHovered || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 238, 255, 0.3)';
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isHovered]);

  return (
    <section 
      id="contact" 
      className="py-64 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas 
        ref={canvasRef} 
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="relative z-10 text-center">
        <div className="mono text-[#b0b0b0] mb-8 text-sm tracking-widest opacity-50">
          @ connect
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">
          Let's build something.
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mono text-sm tracking-widest">
          {[
            { label: 'EMAIL', href: 'mailto:subhamsantra@example.com', icon: <Mail size={16} /> },
            { label: 'LINKEDIN', href: 'https://linkedin.com/in/subhamsantra', icon: <Linkedin size={16} /> },
            { label: 'GITHUB', href: 'https://github.com/subhamsantra', icon: <Github size={16} /> }
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-white hover:text-[#00eeff] transition-all"
            >
              <span className="opacity-40 group-hover:opacity-100 transition-opacity">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
