
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('a, button, [role="button"], .interactive'));
      setIsLarge(!!target.closest('.profile-pic-container'));
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div 
      className={`fixed pointer-events-none z-[9999] rounded-full transition-all duration-200 ease-out flex items-center justify-center
        ${isLarge ? 'w-[120px] h-[120px] border border-[#00eeff]/50' : isHovering ? 'w-8 h-8 bg-[#00eeff]/40' : 'w-5 h-5 bg-[#00eeff]/30'}`}
      style={{ 
        transform: `translate(${position.x - (isLarge ? 60 : isHovering ? 16 : 10)}px, ${position.y - (isLarge ? 60 : isHovering ? 16 : 10)}px)`,
      }}
    />
  );
};

export default CustomCursor;
