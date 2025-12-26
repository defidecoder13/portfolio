
import React, { useState } from 'react';
import { SKILLS } from '../constants';
import { Skill } from '../types';

const Skills: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [pressTimer, setPressTimer] = useState<any>(null);

  const handleStart = (skill: Skill) => {
    const timer = setTimeout(() => {
      setActiveSkill(skill);
    }, 400);
    setPressTimer(timer);
  };

  const handleEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
    setActiveSkill(null);
  };

  return (
    <section id="skills" className="py-32 relative">
      <div className="mono text-[#b0b0b0] mb-12 text-sm tracking-widest opacity-70">
        &gt; SKILLS
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 md:gap-12">
        {SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="interactive relative group flex flex-col items-center justify-center p-4 border border-white/5 hover:border-[#00eeff]/30 transition-all duration-500 rounded-lg hover:bg-white/5"
            onMouseDown={() => handleStart(skill)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={() => handleStart(skill)}
            onTouchEnd={handleEnd}
          >
            {/* Logo Container */}
            <div 
              className="mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.05))' }}
            >
              {React.cloneElement(skill.icon as React.ReactElement<any>, { 
                size: 40,
                strokeWidth: 1.5,
              })}
            </div>

            {/* Name Label */}
            <span className="mono text-[10px] tracking-widest uppercase text-[#b0b0b0] group-hover:text-white transition-colors duration-300">
              {skill.name}
            </span>
            
            {/* Subtle Progress Indicator Dot */}
            <div className="absolute bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-1 h-1 rounded-full bg-[#00eeff]" />
            </div>

            {/* Minimal Progress Bar Background */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-[#00eeff] transform translate-x-[-100%] transition-transform duration-700 ease-out group-hover:translate-x-0"
                  style={{ width: `${skill.level}%` }}
                />
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip for Long Press / Hover Detail */}
      {activeSkill && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-[#0a0a0a] border border-[#00eeff]/20 p-8 w-[90vw] max-w-sm rounded-xl shadow-[0_0_100px_rgba(0,238,255,0.1)] animate-in zoom-in-95 fade-in duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/5 rounded-lg">
              {React.cloneElement(activeSkill.icon as React.ReactElement<any>, { size: 32 })}
            </div>
            <div>
              <h3 className="mono text-[#00eeff] text-xl font-bold">{activeSkill.name}</h3>
              <div className="text-[10px] mono text-[#b0b0b0] tracking-[0.2em]">{activeSkill.level}% PROFICIENCY</div>
            </div>
          </div>
          
          <p className="text-[#b0b0b0] text-sm leading-relaxed mb-6 font-light italic">
            "{activeSkill.description}"
          </p>

          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00eeff] transition-all duration-1000 ease-out" 
              style={{ width: `${activeSkill.level}%` }} 
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Skills;
