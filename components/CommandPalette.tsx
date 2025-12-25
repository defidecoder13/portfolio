
import React, { useEffect, useState } from 'react';
import { Terminal, Command, MousePointer, Sun, Github } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const shortcuts = [
    { key: 'Space (Hold)', desc: 'Invert Reality', icon: <Sun size={14}/> },
    { key: 'Double Click', desc: 'Toggle Dark Grey', icon: <MousePointer size={14}/> },
    { key: 'Type "help"', desc: 'Summon Portal', icon: <Terminal size={14}/> },
    { key: '5x Click Footer', desc: 'Developer Mode', icon: <Command size={14}/> },
  ];

  return (
    <div className={`fixed inset-0 z-[2000] flex items-center justify-center p-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#00eeff]/20 rounded-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00eeff] animate-pulse" />
          <h2 className="mono text-xs uppercase tracking-widest">Aether Command Console</h2>
        </div>
        
        <div className="p-6">
          <p className="text-[#b0b0b0] text-sm mb-6 leading-relaxed">
            Welcome, traveler. You've discovered the hidden interaction layer. Here are your available commands:
          </p>
          
          <div className="space-y-3">
            {shortcuts.map(s => (
              <div key={s.key} className="flex items-center justify-between p-3 bg-white/5 rounded group hover:bg-[#00eeff]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[#00eeff] opacity-40 group-hover:opacity-100">{s.icon}</span>
                  <span className="mono text-[10px] text-white/40">{s.key}</span>
                </div>
                <span className="text-xs">{s.desc}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 py-3 bg-[#00eeff] text-black mono text-[10px] uppercase font-bold tracking-widest hover:brightness-110 transition-all"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
