
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
    <section id="skills" className="py-16 relative">
      <div className="mono text-[#b0b0b0] mb-6 text-sm tracking-widest opacity-70">
        &gt; SKILLS
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        {SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="interactive relative group flex flex-col items-center justify-center p-5 border border-[#00eeff]/20 rounded-xl hover:border-[#00eeff]/50 transition-all duration-500 card hover-glow"
            onMouseDown={() => handleStart(skill)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={() => handleStart(skill)}
            onTouchEnd={handleEnd}
          >
            {/* Logo Container */}
            <div 
              className="mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2"
              style={{ filter: 'drop-shadow(0 0 15px rgba(0, 238, 255, 0.3))' }}
            >
              {React.cloneElement(skill.icon as React.ReactElement<any>, { 
                size: 48,
                strokeWidth: 1.5,
              })}
            </div>

            {/* Name Label */}
            <span className="mono text-xs tracking-wider uppercase text-[#b0b0b0] group-hover:text-[#00eeff] transition-colors duration-300 font-semibold">
              {skill.name}
            </span>
            
            {/* Level Indicator */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-[#0a0a0a] rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div 
                className="h-full bg-gradient-to-r from-[#00eeff] to-[#64feda] transition-all duration-1000 ease-out"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip for Long Press / Hover Detail */}
      {activeSkill && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] card border border-[#00eeff]/30 p-8 w-[90vw] max-w-md rounded-2xl glow-effect animate-in zoom-in-95 fade-in duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-[#0a0a0a]/50 rounded-xl border border-[#00eeff]/20">
              {React.cloneElement(activeSkill.icon as React.ReactElement<any>, { size: 40 })}
            </div>
            <div>
              <h3 className="mono text-[#00eeff] text-xl font-bold">{activeSkill.name}</h3>
              <div className="text-[10px] mono text-[#00eeff]/80 tracking-[0.2em] uppercase">{activeSkill.level}% Proficiency</div>
            </div>
          </div>
          
          <p className="text-[#e0e0e0] text-sm leading-relaxed mb-6 font-light italic">
            "{activeSkill.description}"
          </p>

          <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#00eeff]/10">
            <div 
              className="h-full bg-gradient-to-r from-[#00eeff] to-[#64feda] transition-all duration-1000 ease-out" 
              style={{ width: `${activeSkill.level}%` }} 
            />
          </div>
        </div>
      )}
    </section>
  );
};

const MemoizedSkills = React.memo(Skills);

export default MemoizedSkills;
