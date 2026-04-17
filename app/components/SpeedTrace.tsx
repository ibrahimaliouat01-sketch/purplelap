"use client";

import { useEffect, useRef } from "react";

export default function SpeedTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(280);
  const historyRef = useRef<number[]>([]);
  const idxRef = useRef(0);
  const stepRef = useRef(0);

  const track = [
    { spd: 310, brk: 0 }, { spd: 320, brk: 0 }, { spd: 328, brk: 0 },
    { spd: 140, brk: 95 }, { spd: 95, brk: 80 }, { spd: 110, brk: 0 },
    { spd: 180, brk: 0 }, { spd: 245, brk: 0 }, { spd: 290, brk: 0 },
    { spd: 305, brk: 0 }, { spd: 170, brk: 88 }, { spd: 120, brk: 70 },
    { spd: 135, brk: 0 }, { spd: 210, brk: 0 }, { spd: 260, brk: 0 },
    { spd: 298, brk: 0 }, { spd: 312, brk: 0 }, { spd: 195, brk: 92 },
    { spd: 155, brk: 0 }, { spd: 230, brk: 0 }, { spd: 275, brk: 0 },
    { spd: 315, brk: 0 }, { spd: 330, brk: 0 }, { spd: 160, brk: 90 },
    { spd: 100, brk: 75 }, { spd: 145, brk: 0 }, { spd: 200, brk: 0 },
    { spd: 255, brk: 0 }, { spd: 300, brk: 0 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 240;
    canvas.height = 65;

    const iv = setInterval(() => {
      const seg = track[idxRef.current];
      speedRef.current = Math.round(speedRef.current + (seg.spd - speedRef.current) * 0.15 + (Math.random() - 0.5) * 3);
      historyRef.current.push(speedRef.current);
      if (historyRef.current.length > 120) historyRef.current.shift();

      ctx.clearRect(0, 0, 240, 65);
      if (historyRef.current.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = "#e500ff";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#e500ff";
      ctx.shadowBlur = 4;
      historyRef.current.forEach((v, i) => {
        const x = (i / 120) * 240;
        const y = 60 - ((v - 60) / 280) * 50;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#e500ff44";
      ctx.lineWidth = 0.5;
      [100, 200, 300].forEach((v) => {
        const y = 60 - ((v - 60) / 280) * 50;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(240, y); ctx.stroke();
      });

      stepRef.current++;
      if (stepRef.current >= 15) {
        stepRef.current = 0;
        idxRef.current = (idxRef.current + 1) % track.length;
      }
    }, 80);

    return () => clearInterval(iv);
  }, []);

  return (
    <div className="w-full max-w-[240px] h-[65px] border border-purple-primary/15 relative bg-purple-primary/[0.02]" style={{ boxShadow: "0 0 12px rgba(229,0,255,0.04) inset" }}>
      <span className="absolute top-1 left-2 font-mono text-[9px] tracking-widest text-[#bb99cc] [text-shadow:0_0_4px_#e500ff33]">SPEED TRACE</span>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}