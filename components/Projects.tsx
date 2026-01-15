
import React, { useState, memo } from 'react';
import { PROJECTS } from '../constants.tsx';
import { Project } from '../types.ts';
import ProjectModal from './ProjectModal.tsx';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-16 border-t border-white/5">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00eeff] to-[#64feda] mono">
          Featured Projects
        </h2>
        <div className="text-[#b0b0b0] text-sm tracking-widest opacity-70 mono">
          &gt; PROJECTS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="interactive group cursor-pointer card hover-glow p-6 border border-[#00eeff]/20 rounded-2xl transition-all duration-500 transform hover:-translate-y-2"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#00eeff] group-hover:animate-pulse"></div>
                <h3 className="text-2xl font-semibold text-white group-hover:text-[#00eeff] transition-colors duration-300">
                  {project.name}
                </h3>
              </div>
              <p className="text-[#b0b0b0] text-base flex-grow">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="text-[10px] mono bg-[#0a0a0a] border border-[#00eeff]/20 px-2 py-1 rounded-md text-[#00eeff]">
                    {tech}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="text-[10px] mono bg-[#0a0a0a] border border-[#00eeff]/20 px-2 py-1 rounded-md text-[#b0b0b0]">
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

const MemoizedProjects = React.memo(Projects);

export default MemoizedProjects;