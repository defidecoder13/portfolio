
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { ROLES } from '../constants.tsx';

const Hero: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollScale, setScrollScale] = useState(1);
  
  // The provided avatar image (Base64 or local path)
  const avatarUrl = "https://raw.githubusercontent.com/subhamsantra/subhamsantra/main/avatar.png"; // Fallback URL placeholder
  // Since I cannot create a local file, I will use the provided image as a constant or descriptive path.
  // For the purpose of this update, I'm using the visual representation provided.

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
      // Subtle movement for the 3D parallax effect
      setMousePos({
        x: (clientX / innerWidth - 0.5) * 12,
        y: (clientY / innerHeight - 0.5) * 12,
      });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollScale(1 - progress * 0.75);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="z-10 animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
          SUBHAM SANTRA
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

      {/* Modern Profile Picture with Eye Tracking */}
      <div 
        className="profile-pic-container absolute transition-all duration-700 ease-out z-20 pointer-events-auto"
        style={{
          top: scrollScale < 0.45 ? '40px' : '50%',
          left: scrollScale < 0.45 ? '40px' : '50%',
          transform: `translate(${scrollScale < 0.45 ? '0' : '-50%'}, ${scrollScale < 0.45 ? '0' : '-50%'}) scale(${scrollScale})`,
        }}
      >
        <div 
          className="relative w-52 h-52 rounded-full border border-[#00eeff]/20 overflow-hidden shadow-[0_0_60px_rgba(0,238,255,0.08)] group transition-all duration-300 hover:shadow-[0_0_80px_rgba(0,238,255,0.2)]"
        >
          {/* Main Illustration */}
          <img 
            src="https://raw.githubusercontent.com/subhamsantra/subhamsantra/main/avatar.png" 
            alt="Subham Santra" 
            className="w-full h-full object-cover transition-all duration-700 brightness-[0.9] group-hover:brightness-110"
            style={{ 
              transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px) scale(1.05)`,
              // If image fails, fallback to a stylized circle with initials
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Subham+Santra&background=000&color=0ef&size=512&bold=true`;
            }}
          />

          {/* Interactive Eye Glimmer - Adjusted to match the glasses in the provided pic */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-500">
            <div className="flex gap-[42px] mb-[18px]"> 
              <div 
                className="w-[3px] h-[3px] bg-[#00eeff] rounded-full blur-[1px] shadow-[0_0_8px_#00eeff]" 
                style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }} 
              />
              <div 
                className="w-[3px] h-[3px] bg-[#00eeff] rounded-full blur-[1px] shadow-[0_0_8px_#00eeff]" 
                style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }} 
              />
            </div>
          </div>
          
          {/* Overlay gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
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
