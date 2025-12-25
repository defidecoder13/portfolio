
import React, { useState } from 'react';
import { PROJECTS } from '../constants.tsx';
import { Project } from '../types.ts';
import ProjectModal from './ProjectModal.tsx';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-32 border-t border-white/5">
      <div className="mono text-[#b0b0b0] mb-16 text-sm tracking-widest opacity-50">
        ~ projects
      </div>

      <div className="grid gap-20">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="interactive group cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex flex-col">
              <h3 className="text-4xl md:text-6xl font-light text-white group-hover:text-[#00eeff] transition-all duration-500 transform group-hover:translate-x-4">
                {project.name}
              </h3>
              <p className="mt-4 text-[#b0b0b0] text-lg opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 group-hover:translate-x-4">
                {project.description}
              </p>
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

export default Projects;