
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

      // 1. Warm Ambient Pad - C Major chord (peaceful)
      const freqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
      freqs.forEach((f, i) => {
        const osc = audioCtx.current!.createOscillator();
        const g = audioCtx.current!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, audioCtx.current!.currentTime);
        
        // Slow breathing LFO for gentle pulsing
        const lfo = audioCtx.current!.createOscillator();
        const lfoGain = audioCtx.current!.createGain();
        lfo.frequency.setValueAtTime(0.08 + (i * 0.02), audioCtx.current!.currentTime);
        lfoGain.gain.setValueAtTime(0.015, audioCtx.current!.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        lfo.start();

        g.gain.setValueAtTime(0.02, audioCtx.current!.currentTime);
        
        osc.connect(g);
        g.connect(mainGain.current!);
        osc.start();
        padOscs.current.push(osc);
      });

      // 2. Soft Pink Noise (Ocean-like texture)
      const bufferSize = 2 * audioCtx.current.sampleRate;
      const noiseBuffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      // Generate pink noise (warmer than white noise)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const pinkNoise = audioCtx.current.createBufferSource();
      pinkNoise.buffer = noiseBuffer;
      pinkNoise.loop = true;

      noiseFilter.current = audioCtx.current.createBiquadFilter();
      noiseFilter.current.type = 'lowpass';
      noiseFilter.current.frequency.setValueAtTime(800, audioCtx.current.currentTime);
      noiseFilter.current.Q.setValueAtTime(0.5, audioCtx.current.currentTime);

      const noiseGain = audioCtx.current.createGain();
      noiseGain.gain.setValueAtTime(0.008, audioCtx.current.currentTime);

      pinkNoise.connect(noiseFilter.current);
      noiseFilter.current.connect(noiseGain);
      noiseGain.connect(mainGain.current);
      pinkNoise.start();

      // 3. Musical Bells (Pleasant melody notes)
      const bellNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const spawnBell = () => {
        if (!audioCtx.current || isMuted || Math.random() > 0.25) return;
        
        const note = bellNotes[Math.floor(Math.random() * bellNotes.length)];
        const osc = audioCtx.current.createOscillator();
        const g = audioCtx.current.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, audioCtx.current.currentTime);
        
        g.gain.setValueAtTime(0, audioCtx.current.currentTime);
        g.gain.linearRampToValueAtTime(0.012, audioCtx.current.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 3);
        
        osc.connect(g);
        g.connect(mainGain.current!);
        osc.start();
        osc.stop(audioCtx.current.currentTime + 3);
      };
      setInterval(spawnBell, 6000);
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

  // Handle "Inversion" - Gentle filter sweep
  useEffect(() => {
    if (!audioCtx.current || !noiseFilter.current || isMuted) return;
    const now = audioCtx.current.currentTime;
    if (isInverted) {
      noiseFilter.current.frequency.exponentialRampToValueAtTime(1200, now + 2);
      noiseFilter.current.Q.exponentialRampToValueAtTime(2, now + 2);
    } else {
      noiseFilter.current.frequency.exponentialRampToValueAtTime(800, now + 2);
      noiseFilter.current.Q.exponentialRampToValueAtTime(0.5, now + 2);
    }
  }, [isInverted, isMuted]);

  // UI Interaction - Soft Musical Note
  useEffect(() => {
    if (!audioCtx.current || !mainGain.current || isMuted || !activeInteraction) return;
    const now = audioCtx.current.currentTime;
    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5 note
    
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.008, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(g);
    g.connect(mainGain.current);
    osc.start();
    osc.stop(now + 0.4);
  }, [activeInteraction]);

  return null;
};

export default SoundEngine;
