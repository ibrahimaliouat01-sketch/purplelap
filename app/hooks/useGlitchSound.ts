"use client";

import { useCallback, useRef } from "react";

export function useGlitchSound(volume = 0.22) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;
      const now = ctx.currentTime;

      // Burst of noise pulses simulating a digital glitch
      const bursts = [0, 0.03, 0.06, 0.1, 0.13, 0.18, 0.22];
      bursts.forEach((offset, i) => {
        const bufferSize = ctx.sampleRate * 0.03;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * (i % 2 === 0 ? 1 : 0.4);
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const bpf = ctx.createBiquadFilter();
        bpf.type = "bandpass";
        bpf.frequency.value = 800 + i * 600;
        bpf.Q.value = 1.5;

        const gain = ctx.createGain();
        const env = volume * (1 - i * 0.1);
        gain.gain.setValueAtTime(env, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.03);

        source.connect(bpf);
        bpf.connect(gain);
        gain.connect(ctx.destination);
        source.start(now + offset);
        source.stop(now + offset + 0.04);
      });

      // Short pitched sweep at the end
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(2200, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      oscGain.gain.setValueAtTime(volume * 0.3, now + 0.18);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + 0.18);
      osc.stop(now + 0.36);
    } catch {
      // silently fail
    }
  }, [volume]);

  return play;
}
