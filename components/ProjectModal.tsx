
import React, { useEffect } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl card border border-[#00eeff]/30 h-[85vh] rounded-t-3xl p-8 md:p-12 overflow-y-auto transform transition-transform duration-500 animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#00eeff] hover:text-[#64feda] transition-colors glow-effect p-2 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="max-w-2xl">
          <div className="mono text-[#00eeff] text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00eeff]"></div>
            Project Details
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00eeff] to-[#64feda]">{project.name}</h2>
          
          <p className="text-base md:text-lg text-[#e0e0e0] leading-relaxed mb-8">
            {project.fullDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h4 className="mono text-xs text-[#00eeff] mb-4 uppercase tracking-wider">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-[#0a0a0a] border border-[#00eeff]/20 rounded-md text-xs mono text-[#00eeff]">{t}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mono text-xs text-[#00eeff] mb-4 uppercase tracking-wider">Project Links</h4>
              <a 
                href={project.github} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#00eeff] hover:text-[#64feda] transition-colors group"
              >
                <Github size={16} className="group-hover:animate-pulse"/> View Source
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
          
          <div className="w-full h-64 bg-[#0a0a0a] border border-[#00eeff]/20 rounded-xl flex items-center justify-center italic text-[#b0b0b0]">
            <div className="text-center">
              <div className="text-5xl mb-3">🚀</div>
              <p>Project Preview Coming Soon</p>
              <p className="text-xs text-[#00eeff]/60 mt-2">Visual demonstration of the project</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ProjectModal;
