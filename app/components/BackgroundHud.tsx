"use client";

import { memo, useEffect, useRef, useState } from "react";
import { VT323 } from "next/font/google";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

interface BgLine {
  text: string;
}

interface BgPanelProps {
  label: string;
  lines: BgLine[];
  align?: "left" | "right";
}

const BgPanel = memo(function BgPanel({ label, lines, align = "left" }: BgPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const [glitch, setGlitch] = useState(false);
  const linesSignature = lines.map((line) => line.text).join("||");

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    const glitchIv = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 120);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(glitchIv);
  }, []);

  useEffect(() => {
    const runId = ++runIdRef.current;
    const isCancelled = () => runId !== runIdRef.current;

    async function typewrite(el: HTMLElement, text: string) {
      return new Promise<void>((resolve) => {
        let i = 0;
        const line = document.createElement("div");
        line.className = `${vt323.className} max-w-full overflow-hidden whitespace-nowrap text-ellipsis leading-tight text-2xl text-[#6bc9ff] [text-shadow:0_0_8px_#00a5ff88,0_0_16px_#00a5ff44] tracking-wider ${align === "right" ? "text-right" : ""}`;
        const span = document.createElement("span");
        line.appendChild(span);
        el.appendChild(line);
        const iv = setInterval(() => {
          if (isCancelled()) { clearInterval(iv); resolve(); return; }
          span.textContent = text.slice(0, i + 1);
          i++;
          if (i >= text.length) { clearInterval(iv); resolve(); }
        }, 30 + Math.random() * 25);
      });
    }

    async function runCycle() {
      const el = containerRef.current;
      if (!el) return;
      el.innerHTML = "";
      for (const line of shuffle(lines)) {
        if (isCancelled()) return;
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 700));
        if (isCancelled()) return;
        await typewrite(el, line.text);
      }
    }

    runCycle();
    return () => { runIdRef.current++; };
  }, [linesSignature, align]);

  return (
    <div className="relative w-full h-full" style={{ filter: glitch ? `hue-rotate(${Math.random() * 40 - 20}deg) contrast(1.3)` : "none", transform: glitch ? `translateX(${(Math.random() - 0.5) * 4}px)` : "none", transition: "transform 0.05s" }}>
      <svg viewBox="0 0 380 240" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,1 360,1 379,20 379,220 360,239 20,239 1,220 1,20" fill="rgba(0,165,255,0.025)" stroke="#00a5ff" strokeWidth="0.7" opacity="0.45" />
        <line x1="1" y1="20" x2="20" y2="1" stroke="#00a5ff" strokeWidth="1.4" opacity="0.65" />
        <line x1="360" y1="1" x2="379" y2="20" stroke="#00a5ff" strokeWidth="1.4" opacity="0.65" />
        <line x1="379" y1="220" x2="360" y2="239" stroke="#00a5ff" strokeWidth="1.4" opacity="0.65" />
        <line x1="20" y1="239" x2="1" y2="220" stroke="#00a5ff" strokeWidth="1.4" opacity="0.65" />
      </svg>
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,165,255,0.08) 2px, rgba(0,165,255,0.08) 3px)" }} />
      {glitch && <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(${Math.random() * 360}deg, transparent, rgba(255,0,255,0.15), transparent)`, mixBlendMode: "screen" }} />}
      <div className="px-6 py-5 relative">
        <div className={`${vt323.className} text-lg tracking-[0.25em] mb-3 text-[#00a5ff] [text-shadow:0_0_6px_#00a5ff99,0_0_12px_#00a5ff44] ${align === "right" ? "text-right" : ""}`}>◣ {label}</div>
        <div ref={containerRef} className="min-h-[120px] max-h-[120px] overflow-hidden space-y-1" />
      </div>
    </div>
  );
}, (prev, next) => {
  if (prev.label !== next.label || prev.align !== next.align) return false;
  if (prev.lines.length !== next.lines.length) return false;
  for (let i = 0; i < prev.lines.length; i++) {
    if (prev.lines[i].text !== next.lines[i].text) return false;
  }
  return true;
});

interface SectionBgHudProps {
  side: "left" | "right";
  label: string;
  lines: BgLine[];
  opacity?: number;
  verticalPosition?: "top" | "center" | "bottom";
  offset?: string;
  parallaxStrength?: number;
}

export function SectionBgHud({ side, label, lines, opacity = 0.24, verticalPosition = "center", offset = "1rem", parallaxStrength = 0.3 }: SectionBgHudProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = elementCenter - viewportCenter;
      setParallaxY(-distance * parallaxStrength);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [parallaxStrength]);

  const verticalClass = verticalPosition === "top" ? "top-4" : verticalPosition === "bottom" ? "bottom-4" : "top-1/2 -translate-y-1/2";
  const rotation = side === "left" ? 12 : -12;
  const origin = side === "left" ? "right center" : "left center";
  const xOffset = visible ? "0" : side === "left" ? "-30px" : "30px";

  return (
    <div
      ref={ref}
      className={`absolute ${verticalClass} w-[380px] h-[240px] pointer-events-none hidden lg:block z-0`}
      style={{
        [side]: offset,
        transform: `perspective(800px) rotateY(${rotation}deg) translate3d(${xOffset}, calc(${parallaxY}px + 60px), 0)`,
        transformOrigin: origin,
        opacity: visible ? opacity : 0,
        transition: "opacity 0.7s ease-out",
        willChange: "transform",
      }}
    >
      <BgPanel label={label} lines={lines} align={side} />
    </div>
  );
}

export default function BackgroundHud() {
  return null;
}