
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Skills from './components/Skills.tsx';
import Projects from './components/Projects.tsx';
import Contact from './components/Contact.tsx';
import Footer from './components/Footer.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import Background from './components/Background.tsx';
import SoundEngine from './components/SoundEngine.tsx';
import { ThemeMode } from './types.ts';

const App: React.FC = () => {
  const [isInverted, setIsInverted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.PURE_BLACK);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [typedChars, setTypedChars] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [interactionTrigger, setInteractionTrigger] = useState(false);

  // Handle key listeners for hidden features
  useEffect(() => {
    let spaceTimer: any;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!spaceTimer) {
          spaceTimer = setTimeout(() => {
            setIsInverted(true);
          }, 800); // Reduced delay for better sound sync
        }
      }

      const nextTyped = (typedChars + e.key.toLowerCase()).slice(-4);
      setTypedChars(nextTyped);
      if (nextTyped === 'help') {
        setShowCommandPalette(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        clearTimeout(spaceTimer);
        spaceTimer = null;
        setIsInverted(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [typedChars]);

  // Global Interaction Sound Trigger
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .interactive')) {
        setInteractionTrigger(prev => !prev);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initial load animation
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setTheme(prev => prev === ThemeMode.PURE_BLACK ? ThemeMode.DARK_GRAY : ThemeMode.PURE_BLACK);
  }, []);

  return (
    <div 
      className={`min-h-screen transition-colors duration-1000 ${isInverted ? 'inverted' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: theme }}
      onDoubleClick={handleDoubleClick}
    >
      <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-white text-black px-4 py-2">
        Skip to content
      </a>

      <SoundEngine 
        isMuted={isMuted} 
        isInverted={isInverted} 
        activeInteraction={interactionTrigger} 
      />
      
      <Background />
      <CustomCursor />
      <Navbar onToggleAudio={() => setIsMuted(!isMuted)} isMuted={isMuted} />
      
      <div className="fixed right-0 top-0 h-full w-[2px] z-50 overflow-hidden pointer-events-none">
        <div 
          className="bg-[#00eeff] w-full transition-all duration-300" 
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      <main className="max-w-6xl mx-auto px-6 md:px-12 selection-glow relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />

      {showCommandPalette && (
        <CommandPalette onClose={() => setShowCommandPalette(false)} />
      )}
    </div>
  );
};

export default App;
