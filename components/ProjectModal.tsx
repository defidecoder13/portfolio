
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
      
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] h-[85vh] rounded-t-3xl border-t border-white/10 p-8 md:p-16 overflow-y-auto transform transition-transform duration-500 animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        <div className="max-w-2xl">
          <div className="mono text-[#00eeff] text-sm mb-6 uppercase tracking-widest">Project Details</div>
          <h2 className="text-5xl font-black mb-8">{project.name}</h2>
          
          <p className="text-xl text-[#b0b0b0] leading-relaxed mb-12">
            {project.fullDescription}
          </p>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h4 className="mono text-xs text-white/40 mb-4 uppercase">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-xs mono">{t}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mono text-xs text-white/40 mb-4 uppercase">Links</h4>
              <a 
                href={project.github} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-[#00eeff] hover:underline"
              >
                <Github size={16} /> Source Code
              </a>
            </div>
          </div>
          
          <div className="w-full h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center italic text-white/20">
            [ Project Visualization Placeholder ]
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
