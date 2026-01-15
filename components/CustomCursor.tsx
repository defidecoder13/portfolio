
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const throttleDelay = 16; // ~60fps
  
  useEffect(() => {
    const updateState = (e: MouseEvent) => {
      const now = performance.now();
      
      if (now - lastUpdateRef.current >= throttleDelay) {
        lastUpdateRef.current = now;
        
        const target = e.target as HTMLElement;
        
        // Batch DOM reads
        const newIsHovering = !!target.closest('a, button, [role="button"], .interactive');
        const newIsLarge = !!target.closest('.profile-pic-container');
        
        // Only update if values have changed
        if (newIsHovering !== isHovering || newIsLarge !== isLarge) {
          setIsHovering(newIsHovering);
          setIsLarge(newIsLarge);
        }
        
        // Update position
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const throttledHandler = (e: MouseEvent) => {
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Schedule update for next animation frame
      animationFrameRef.current = requestAnimationFrame(() => {
        updateState(e);
      });
    };

    window.addEventListener('mousemove', throttledHandler);
    
    return () => {
      window.removeEventListener('mousemove', throttledHandler);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovering, isLarge]);

  return (
    <div 
      className={`fixed pointer-events-none z-[9999] rounded-full transition-all duration-150 ease-out flex items-center justify-center
        ${isLarge ? 'w-[120px] h-[120px] border border-[#00eeff]/50' : isHovering ? 'w-8 h-8 bg-[#00eeff]/40' : 'w-5 h-5 bg-[#00eeff]/30'}`}
      style={{ 
        transform: `translate(${position.x - (isLarge ? 60 : isHovering ? 16 : 10)}px, ${position.y - (isLarge ? 60 : isHovering ? 16 : 10)}px)`,
        // Optimize rendering
        willChange: 'transform',
      }}
    />
  );
};

export default CustomCursor;
