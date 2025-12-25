
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { ROLES } from '../constants';

const Hero: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [profileToggle, setProfileToggle] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollScale, setScrollScale] = useState(1);
  const [scrollPosition, setScrollPosition] = useState({ top: '50%', left: '50%' });
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (clientX / innerWidth - 0.5) * 15,
        y: (clientY / innerHeight - 0.5) * 15,
      });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      setScrollScale(1 - progress * 0.7);
      // Logic for moving profile pic to corner
      if (progress > 0.1) {
        setScrollPosition({ top: `${50 - progress * 45}%`, left: `${50 - progress * 45}%` });
      } else {
        setScrollPosition({ top: '50%', left: '50%' });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const pfpUrl = profileToggle 
    ? 'public/github dp 2.jpg'
    : 'public/github dp 2.jpg';

  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Centered Profile Picture */}
      <div 
        className="profile-pic-container mb-8 transition-all duration-700 ease-out z-20 pointer-events-auto cursor-pointer"
        style={{
          transform: `scale(${scrollScale})`,
        }}
        onClick={() => setProfileToggle(!profileToggle)}
      >
        <div 
          className="relative w-48 h-48 rounded-full border border-[#00eeff]/20 overflow-hidden shadow-[0_0_50px_rgba(0,238,255,0.1)] group transition-all duration-300 hover:shadow-[0_0_80px_rgba(0,238,255,0.25)] animate-pulse"
          style={{ 
            animationDuration: '4s',
          }}
        >
          <img 
            src={pfpUrl} 
            alt="Profile" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            style={{ 
              transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.1)` 
            }}
          />
          {/* Subtle Eye Follow Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-30">
            <div className="flex gap-8">
              <div className="w-1 h-1 bg-white rounded-full blur-[1px]" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }} />
              <div className="w-1 h-1 bg-white rounded-full blur-[1px]" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="z-10 animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-tight">
          SUBHAM<br />SANTRA
        </h1>
        
        <div className="h-8 overflow-hidden mono text-[#00eeff] text-xl tracking-widest uppercase">
          <div 
            className="transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${roleIndex * 32}px)` }}
          >
            {ROLES.map((role) => (
              <div key={role} className="h-8 flex items-center justify-center">
                {role}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 animate-bounce opacity-40">
        <ChevronDown size={32} />
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
