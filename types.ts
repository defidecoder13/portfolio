
import { ReactNode } from 'react';

export interface Skill {
  name: string;
  level: number;
  description: string;
  icon: ReactNode;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  tech: string[];
  github: string;
}

export enum ThemeMode {
  PURE_BLACK = '#000000',
  DARK_GRAY = '#0a0a0a',
}
