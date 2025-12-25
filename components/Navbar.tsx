
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  onToggleAudio?: () => void;
  isMuted?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleAudio, isMuted }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 px-8 md:px-16 flex items-center justify-between z-[100] bg-transparent backdrop-blur-[2px]">
      <div className="text-lg font-bold tracking-tighter flex items-center gap-4">
        <span>SUBHAM SANTRA</span>
        <button 
          onClick={onToggleAudio}
          className="p-2 text-[#b0b0b0] hover:text-[#00eeff] transition-all transform hover:scale-110 active:scale-90"
          title={isMuted ? "Enable Audio" : "Disable Audio"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
        </button>
      </div>
      
      <div className="flex gap-10 md:gap-16 mono text-xs uppercase tracking-widest text-[#b0b0b0]">
        {['Work', 'Code', 'Contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item.toLowerCase() === 'work' ? 'projects' : item.toLowerCase() === 'code' ? 'skills' : 'contact')}
            className="hover:text-white transition-colors hover:scale-105"
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
