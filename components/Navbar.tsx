
import React from 'react';

const Navbar: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 px-8 md:px-16 flex items-center justify-between z-[100] bg-transparent backdrop-blur-[2px]">
      <div className="text-lg font-bold tracking-tighter">
        SUBHAM SANTRA
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
