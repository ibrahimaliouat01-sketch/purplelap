"use client";

import { memo, useEffect, useRef } from "react";

interface HudLine {
  text: string;
  color: "purple" | "dim" | "cyan" | "green";
}

interface HudPanelProps {
  label: string;
  lines: HudLine[];
  align?: "left" | "right";
  className?: string;
}

const colorMap = {
  purple: "text-[#ff44ff] [text-shadow:0_0_6px_#e500ff88,0_0_12px_#e500ff44]",
  dim: "text-[#bb99cc] [text-shadow:0_0_4px_#e500ff33]",
  cyan: "text-[#44eeff] [text-shadow:0_0_6px_#00e5ff88,0_0_12px_#00e5ff44]",
  green: "text-[#44ff88] [text-shadow:0_0_6px_#22ff6688,0_0_12px_#22ff6644]",
};

function HudPanel({ label, lines, align = "left", className = "" }: HudPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const linesSignature = lines.map((line) => `${line.text}:${line.color}`).join("||");

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    const runId = ++runIdRef.current;
    const isCancelled = () => runId !== runIdRef.current;

    async function typewrite(el: HTMLElement, text: string, colorClass: string) {
      return new Promise<void>((resolve) => {
        let i = 0;
        const line = document.createElement("div");
        line.className = `font-mono text-xs max-w-full overflow-hidden whitespace-nowrap text-ellipsis ${colorClass} ${align === "right" ? "text-right" : ""}`;
        const span = document.createElement("span");
        const cur = document.createElement("span");
        cur.textContent = "\u2588";
        cur.className = `animate-pulse ${colorClass}`;
        line.appendChild(span);
        line.appendChild(cur);
        el.appendChild(line);
        const iv = setInterval(() => {
          if (isCancelled()) {
            clearInterval(iv);
            resolve();
            return;
          }
          span.textContent = text.slice(0, i + 1);
          i++;
          if (i >= text.length) {
            clearInterval(iv);
            cur.remove();
            resolve();
          }
        }, 25 + Math.random() * 20);
      });
    }

    async function runCycle() {
      while (!isCancelled()) {
        const el = containerRef.current;
        if (!el) return;
        el.innerHTML = "";
        for (const line of shuffle(lines)) {
          if (isCancelled()) return;
          await new Promise((r) => setTimeout(r, 200 + Math.random() * 1500));
          if (isCancelled()) return;
          await typewrite(el, line.text, colorMap[line.color]);
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    runCycle();

    return () => {
      runIdRef.current++;
    };
  }, [linesSignature, align]);

  return (
    <div className={`border border-purple-primary/20 p-2.5 bg-purple-primary/[0.03] relative ${className}`} style={{ boxShadow: "0 0 15px rgba(229,0,255,0.05) inset, 0 0 30px rgba(229,0,255,0.03)" }}>
      <div className="absolute -top-px -left-px w-2 h-2 border-l-2 border-t-2 border-purple-primary" />
      <div className="absolute -top-px -right-px w-2 h-2 border-r-2 border-t-2 border-purple-primary" />
      <div className={`font-mono text-[9px] tracking-widest mb-1.5 text-[#ff44ff] [text-shadow:0_0_6px_#e500ff88] ${align === "right" ? "text-right" : ""}`}>{label}</div>
      <div ref={containerRef} className="overflow-hidden" />
    </div>
  );
}

function sameLines(a: HudLine[], b: HudLine[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].text !== b[i].text || a[i].color !== b[i].color) return false;
  }
  return true;
}

export default memo(HudPanel, (prev, next) =>
  prev.label === next.label &&
  prev.align === next.align &&
  prev.className === next.className &&
  sameLines(prev.lines, next.lines)
);