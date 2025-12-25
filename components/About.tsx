
import React, { useState, useEffect, useRef } from 'react';

const About: React.FC = () => {
  const [tone, setTone] = useState<'professional' | 'casual'>('professional');
  const [text, setText] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const content = {
    professional: "I am a meticulous MCA graduate specializing in high-performance web architectures. My core competency lies in bridging the gap between sophisticated backend logic and fluid user experiences. I prioritize clean code, scalability, and robust security in every deployment.",
    casual: "Hey! I'm an MCA grad who loves turning caffeine into clean code. I'm obsessed with tiny details, dark mode, and making things go fast on the web. When I'm not debugging, you'll probably find me exploring the latest tech stacks or dreaming about minimalist UI."
  };

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  // Typing animation effect
  useEffect(() => {
    if (!hasAnimated) return;
    
    let currentText = content[tone];
    let i = 0;
    setText('');
    const interval = setInterval(() => {
      setText(currentText.slice(0, i));
      i++;
      if (i > currentText.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [tone, hasAnimated]);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-32 relative group" 
      onDoubleClick={() => setTone(prev => prev === 'professional' ? 'casual' : 'professional')}
    >
      <div className="mono text-[#b0b0b0] mb-8 text-sm tracking-widest opacity-50">
        // about
      </div>
      
      <div className="max-w-3xl">
        <p className="text-2xl md:text-3xl font-light leading-relaxed text-white transition-opacity duration-300">
          {text}
          <span className="animate-pulse inline-block w-2 h-8 bg-[#00eeff] ml-1 align-middle" />
        </p>
      </div>

      <div className="mt-8 text-[10px] mono uppercase tracking-widest text-[#00eeff] opacity-0 group-hover:opacity-100 transition-opacity">
        Double click to toggle {tone === 'professional' ? 'casual' : 'professional'} tone
      </div>
    </section>
  );
};

export default About;
