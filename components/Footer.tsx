
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [devMode, setDevMode] = useState(false);

  const handleMinimalismClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next === 5) {
        setDevMode(true);
        setTimeout(() => setDevMode(false), 5000);
      }
      return next;
    });
  };

  return (
    <footer className="py-20 border-t border-white/5 text-center">
      <div className="mono text-[10px] tracking-[0.3em] text-[#555] flex items-center justify-center gap-4">
        <span>© {new Date().getFullYear()}</span>
        <span className="w-1 h-1 rounded-full bg-white/10" />
        <span>
          Made with{' '}
          <button 
            onClick={handleMinimalismClick}
            className={`transition-colors duration-500 hover:text-[#00eeff] ${devMode ? 'text-[#00eeff] glow-text' : ''}`}
          >
            Passion
          </button>
        </span>
      </div>

      {devMode && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[500] border-4 border-[#00eeff] opacity-20 animate-pulse" />
      )}

      <style>{`
        .glow-text {
          text-shadow: 0 0 10px #00eeff, 0 0 20px #00eeff;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
