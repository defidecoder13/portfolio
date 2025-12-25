
import React, { useEffect, useRef } from 'react';

interface SoundEngineProps {
  isMuted: boolean;
  isInverted: boolean;
  activeInteraction: boolean;
}

const SoundEngine: React.FC<SoundEngineProps> = ({ isMuted, isInverted, activeInteraction }) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const mainGain = useRef<GainNode | null>(null);
  const padOscs = useRef<OscillatorNode[]>([]);
  const noiseFilter = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (audioCtx.current) return;
      
      const Context = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx.current = new Context();
      
      mainGain.current = audioCtx.current.createGain();
      mainGain.current.connect(audioCtx.current.destination);
      mainGain.current.gain.setValueAtTime(0, audioCtx.current.currentTime);

      // 1. Ethereal Pads (Deep Space Breathing)
      // We use 3 sine oscillators slightly detuned to create a "shimmer"
      const freqs = [110, 164.81, 220]; // A2, E3, A3 (Harmonic minor feel)
      freqs.forEach((f, i) => {
        const osc = audioCtx.current!.createOscillator();
        const g = audioCtx.current!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, audioCtx.current!.currentTime);
        
        // LFO for "Breathing" effect
        const lfo = audioCtx.current!.createOscillator();
        const lfoGain = audioCtx.current!.createGain();
        lfo.frequency.setValueAtTime(0.1 + (i * 0.05), audioCtx.current!.currentTime);
        lfoGain.gain.setValueAtTime(0.02, audioCtx.current!.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        lfo.start();

        g.gain.setValueAtTime(0.03, audioCtx.current!.currentTime);
        
        osc.connect(g);
        g.connect(mainGain.current!);
        osc.start();
        padOscs.current.push(osc);
      });

      // 2. Solar Wind (Filtered White Noise)
      const bufferSize = 2 * audioCtx.current.sampleRate;
      const noiseBuffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.current.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      noiseFilter.current = audioCtx.current.createBiquadFilter();
      noiseFilter.current.type = 'lowpass';
      noiseFilter.current.frequency.setValueAtTime(400, audioCtx.current.currentTime);
      noiseFilter.current.Q.setValueAtTime(2, audioCtx.current.currentTime);

      const noiseGain = audioCtx.current.createGain();
      noiseGain.gain.setValueAtTime(0.015, audioCtx.current.currentTime);

      whiteNoise.connect(noiseFilter.current);
      noiseFilter.current.connect(noiseGain);
      noiseGain.connect(mainGain.current);
      whiteNoise.start();

      // 3. Ambient Chimes (Occasional random sparkle)
      const spawnChime = () => {
        if (!audioCtx.current || isMuted || Math.random() > 0.3) return;
        const cOsc = audioCtx.current.createOscillator();
        const cGain = audioCtx.current.createGain();
        cOsc.type = 'sine';
        cOsc.frequency.setValueAtTime(1200 + Math.random() * 2000, audioCtx.current.currentTime);
        cGain.gain.setValueAtTime(0, audioCtx.current.currentTime);
        cGain.gain.linearRampToValueAtTime(0.005, audioCtx.current.currentTime + 1);
        cGain.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + 4);
        cOsc.connect(cGain);
        cGain.connect(mainGain.current!);
        cOsc.start();
        cOsc.stop(audioCtx.current.currentTime + 4);
      };
      setInterval(spawnChime, 5000);
    };

    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('mousedown', handleInteraction);
    };
    window.addEventListener('mousedown', handleInteraction);
    return () => window.removeEventListener('mousedown', handleInteraction);
  }, [isMuted]);

  // Handle Global Mute
  useEffect(() => {
    if (!mainGain.current || !audioCtx.current) return;
    const target = isMuted ? 0 : 0.6;
    mainGain.current.gain.setTargetAtTime(target, audioCtx.current.currentTime, 1.2);
  }, [isMuted]);

  // Handle "Inversion" - A glassy harmonic swell
  useEffect(() => {
    if (!audioCtx.current || !noiseFilter.current || isMuted) return;
    const now = audioCtx.current.currentTime;
    if (isInverted) {
      noiseFilter.current.frequency.exponentialRampToValueAtTime(3000, now + 1.5);
      noiseFilter.current.Q.exponentialRampToValueAtTime(15, now + 1.5);
    } else {
      noiseFilter.current.frequency.exponentialRampToValueAtTime(400, now + 2);
      noiseFilter.current.Q.exponentialRampToValueAtTime(2, now + 2);
    }
  }, [isInverted, isMuted]);

  // UI Interaction - Delicate Glass Ping
  useEffect(() => {
    if (!audioCtx.current || !mainGain.current || isMuted || !activeInteraction) return;
    const now = audioCtx.current.currentTime;
    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    
    g.gain.setValueAtTime(0.01, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(g);
    g.connect(mainGain.current);
    osc.start();
    osc.stop(now + 0.3);
  }, [activeInteraction]);

  return null;
};

export default SoundEngine;
