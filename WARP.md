# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a minimalist dark-themed portfolio website built with React, TypeScript, and Vite. The portfolio features an immersive space/black hole-themed background with interactive visual effects, ambient audio, and hidden Easter eggs.

**Key Technologies:**
- React 19 with TypeScript
- Vite for build tooling
- Lucide React for icons
- Canvas API for custom graphics
- Web Audio API for ambient sound design

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build locally
```

### Installation
```bash
npm install          # Install all dependencies
```

## Architecture & Code Structure

### Component Organization
The application follows a flat component structure with all components in `/components`:
- **No nested component directories** - all components are top-level in the components folder
- Components are imported using relative paths with `.tsx` extensions explicitly specified

### Entry Point Flow
`index.tsx` → `App.tsx` → Individual section components

### Core Application State (App.tsx)
The main App component manages global state for the entire portfolio:
- **Theme system**: `ThemeMode` enum supports pure black (#000000) and dark gray (#0a0a0a) - toggled via double-click
- **Inversion mode**: Visual color inversion triggered by holding spacebar (800ms delay)
- **Audio state**: Global mute/unmute toggle for ambient soundscape
- **Command palette**: Hidden feature activated by typing "help"
- **Scroll progress**: Tracked and displayed as a cyan progress bar on the right edge

### Key Architectural Patterns

#### 1. Background Rendering System (Background.tsx)
Complex Canvas-based animation system featuring:
- **Black hole simulation**: Accretion disk with ~1600 particles using Doppler-shifted colors (blue for approaching matter, red for receding)
- **3D effects**: Mouse parallax on all elements, scroll-based speed modifications
- **Interactive ripples**: Click anywhere to generate expanding cyan ripples
- **Starfield layers**: 450+ stars with depth-based parallax, plus random shooting stars
- **Physics simulation**: Orbital mechanics with gravitational lensing effects

**Performance considerations:**
- Uses `requestAnimationFrame` for smooth 60fps rendering
- Canvas context created with `{ alpha: false }` for optimization
- Particle recycling when they fall into the black hole

#### 2. Audio System (SoundEngine.tsx)
Procedural Web Audio API implementation:
- **Ambient pads**: Three detuned sine waves (A2, E3, A3) with LFO-driven gain modulation for "breathing" effect
- **Solar wind**: Filtered white noise at 400Hz with Q=2, sweeps to 3000Hz/Q=15 during inversion mode
- **Random chimes**: Spawned every 5 seconds at 1200-3200Hz with 4-second decay
- **Interaction sounds**: Delicate glass ping (1800Hz → 1200Hz) on hover over interactive elements
- **Lazy initialization**: Audio context created on first user interaction (mousedown) to comply with browser autoplay policies

#### 3. Hidden Features & Easter Eggs
- **Spacebar hold**: Activates inversion mode (visual + audio changes) after 800ms
- **Type "help"**: Opens command palette with keyboard shortcuts
- **Double-click**: Toggles between pure black and dark gray themes
- **Mouse interactions**: All links/buttons trigger subtle audio feedback

### Data Architecture

#### Constants (constants.tsx)
Centralized data definitions using typed interfaces from `types.ts`:
- **SKILLS**: Array of 12 skill objects with icons (Lucide), proficiency levels (0-100), and descriptions
- **PROJECTS**: Array of project objects with tech stacks and GitHub links
- **ROLES**: Rotating role strings for Hero section animation

#### Type System (types.ts)
Strict TypeScript interfaces ensure type safety:
- `Skill`: Includes ReactNode icon for composition
- `Project`: Supports both short and full descriptions
- `ThemeMode`: Enum with hex color values

### Import Path Convention
All imports use **explicit `.tsx`/`.ts` extensions** due to `allowImportingTsExtensions: true` in tsconfig:
```typescript
import Hero from './components/Hero.tsx';     // ✓ Correct
import { SKILLS } from './constants.tsx';     // ✓ Correct
import Hero from './components/Hero';         // ✗ Will not resolve
```

### Styling Architecture
- **No external CSS framework**: Tailwind CSS is NOT used despite being mentioned in project data
- **Inline Tailwind-like classes**: The codebase uses utility class naming patterns but these are custom, not from Tailwind
- **Custom CSS**: Inline `<style>` tags in components (see Hero.tsx for keyframe animations)
- **Theme colors**: Cyan accent (#00eeff) used consistently throughout
- **Monospace font**: Applied via `mono` class for technical/code-like text

### Environment Variables
Vite config exposes environment variables via `defineConfig`:
- `GEMINI_API_KEY` → mapped to both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`
- Must be set in `.env.local` file (gitignored via `*.local` pattern)

### Event Handling Patterns
Global event listeners are commonly used for cross-component features:
- Keyboard events for spacebar detection and "help" typing sequence
- Mouse events for parallax, ripples, and audio triggers
- Scroll events for progress tracking and visual scaling

### Build Configuration
- **Dev server**: Runs on port 3000, bound to 0.0.0.0 (accessible on network)
- **Module resolution**: Uses `bundler` mode with path alias `@/*` pointing to root
- **React**: Configured with Fast Refresh via `@vitejs/plugin-react`

## Important Implementation Notes

### When Adding New Components
1. Place directly in `/components` folder (no subdirectories)
2. Import with explicit `.tsx` extension
3. Use React.FC typing with explicit prop interfaces
4. Leverage global event listeners for cross-component state (see App.tsx patterns)

### When Modifying Visual Effects
- Background.tsx contains all canvas rendering - particle counts and physics constants are at the top
- Maintain 60fps by avoiding expensive operations in draw loops
- Colors use rgba for transparency - cyan theme is `rgba(0, 238, 255, *)`

### When Adjusting Audio
- All audio initialization must wait for user interaction (browser policy)
- Main gain node is the master volume control
- Ambient sounds loop indefinitely; interaction sounds use `osc.stop(time)` for cleanup

### Testing Interactive Features
The portfolio has no automated tests. To verify functionality:
1. Test spacebar hold for inversion (hold for 1+ second)
2. Type "help" to trigger command palette
3. Double-click anywhere to toggle theme
4. Click to create ripples
5. Hover over links to hear audio feedback (unmute first)

## Browser Compatibility Notes
- Requires modern browser with Canvas API and Web Audio API support
- Audio context uses `window.AudioContext || webkitAudioContext` for Safari compatibility
- No polyfills included - ES2022 target assumes recent browser versions
