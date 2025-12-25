
import React from 'react';
import { 
  FileCode2, 
  Palette, 
  Zap, 
  Atom, 
  Server, 
  Layers, 
  Database, 
  Wind, 
  Code,
  GitBranch,
  Terminal,
  Globe
} from 'lucide-react';
import { Skill, Project } from './types';

export const SKILLS: Skill[] = [
  { 
    name: 'HTML', 
    level: 95, 
    description: 'Advanced semantic HTML5, accessibility (A11y), and SEO best practices.', 
    icon: <FileCode2 className="text-[#FF5722]" /> 
  },
  { 
    name: 'CSS', 
    level: 90, 
    description: 'Modern CSS3, Flexbox, Grid, animations, and responsive design systems.', 
    icon: <Palette className="text-[#2196F3]" /> 
  },
  { 
    name: 'JS', 
    level: 92, 
    description: 'ES6+ core concepts, asynchronous patterns, and DOM manipulation.', 
    icon: <Zap className="text-[#FFDF00]" /> 
  },
  { 
    name: 'TYPESCRIPT', 
    level: 88, 
    description: 'Type-safe development with interfaces, generics, and strict type checking.', 
    icon: <Code className="text-[#3178C6]" /> 
  },
  { 
    name: 'REACT', 
    level: 94, 
    description: 'Functional components, Hooks, Context API, and Virtual DOM optimization.', 
    icon: <Atom className="text-[#61DAFB]" /> 
  },
  { 
    name: 'NEXT', 
    level: 90, 
    description: 'Server-side rendering (SSR), Static Generation (SSG), and API routes.', 
    icon: <Layers className="text-white" /> 
  },
  { 
    name: 'NODE', 
    level: 85, 
    description: 'Server-side JavaScript environment for building scalable network applications.', 
    icon: <Server className="text-[#8CC84B]" /> 
  },
  { 
    name: 'SUPABASE', 
    level: 80, 
    description: 'Backend-as-a-Service using PostgreSQL, Realtime, and Authentication.', 
    icon: <Database className="text-[#3ECF8E]" /> 
  },
  { 
    name: 'TAILWIND', 
    level: 96, 
    description: 'Utility-first CSS framework for rapid UI development and prototyping.', 
    icon: <Wind className="text-[#38BDF8]" /> 
  },
  { 
    name: 'GIT', 
    level: 88, 
    description: 'Distributed version control system for tracking changes in source code.', 
    icon: <GitBranch className="text-[#F05032]" /> 
  },
  { 
    name: 'REST API', 
    level: 92, 
    description: 'Designing and consuming scalable, stateless web services.', 
    icon: <Globe className="text-[#00eeff]" /> 
  },
  { 
    name: 'TERMINAL', 
    level: 85, 
    description: 'Proficiency in Bash/Zsh scripting and command-line automation.', 
    icon: <Terminal className="text-[#A9B1D6]" /> 
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Nebula Dashboard",
    description: "A real-time data visualization platform for cloud metrics.",
    fullDescription: "Nebula is a specialized monitoring tool designed for multi-cloud environments. It features real-time streaming data via WebSockets and interactive D3.js visualizations.",
    tech: ["React", "D3.js", "Supabase", "Tailwind"],
    github: "https://github.com/subhamsantra"
  },
  {
    id: 2,
    name: "Flux Engine",
    description: "Lightweight state management library for React Native.",
    fullDescription: "Flux Engine focuses on zero-dependency state synchronization between native modules and JS thread, optimized for 60FPS animations.",
    tech: ["TypeScript", "React Native", "Turbo Modules"],
    github: "https://github.com/subhamsantra"
  },
  {
    id: 3,
    name: "Aether OS",
    description: "Browser-based desktop environment simulator.",
    fullDescription: "Aether OS recreates a full desktop experience inside the browser, complete with file systems, window management, and custom apps.",
    tech: ["Next.js", "Node.js", "PostgreSQL"],
    github: "https://github.com/subhamsantra"
  }
];

export const ROLES = ["Developer", "Creator", "Problem Solver", "MCA Graduate"];
