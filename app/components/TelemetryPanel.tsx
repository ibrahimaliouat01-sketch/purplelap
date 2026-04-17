"use client";

import { useEffect, useState } from "react";

const track = [
  { spd: 310, thr: 100, brk: 0 }, { spd: 320, thr: 100, brk: 0 }, { spd: 328, thr: 100, brk: 0 },
  { spd: 140, thr: 0, brk: 95 }, { spd: 95, thr: 0, brk: 80 }, { spd: 110, thr: 40, brk: 0 },
  { spd: 180, thr: 80, brk: 0 }, { spd: 245, thr: 100, brk: 0 }, { spd: 290, thr: 100, brk: 0 },
  { spd: 305, thr: 100, brk: 0 }, { spd: 170, thr: 0, brk: 88 }, { spd: 120, thr: 0, brk: 70 },
  { spd: 210, thr: 90, brk: 0 }, { spd: 298, thr: 100, brk: 0 }, { spd: 195, thr: 0, brk: 92 },
  { spd: 230, thr: 85, brk: 0 }, { spd: 315, thr: 100, brk: 0 }, { spd: 160, thr: 0, brk: 90 },
  { spd: 255, thr: 100, brk: 0 }, { spd: 300, thr: 100, brk: 0 },
];

export default function TelemetryPanel({ side }: { side: "left" | "right" }) {
  const [data, setData] = useState({ spd: 280, thr: 100, brk: 0, fuel: 105, ers: 4, brkT: 412, tyreT: 78 });

  useEffect(() => {
    let idx = 0, step = 0, spd = 280, thr = 100, brk = 0, fuel = 105, ers = 4, brkT = 412, tyreT = 78;
    const iv = setInterval(() => {
      const seg = track[idx];
      spd = Math.round(spd + (seg.spd - spd) * 0.15 + (Math.random() - 0.5) * 3);
      thr = Math.round(thr + (seg.thr - thr) * 0.2);
      brk = seg.brk > 0 ? Math.round(brk + (seg.brk - brk) * 0.2) : Math.round(brk * 0.7);
      if (brk < 1) brk = 0;
      fuel = Math.max(0, fuel - 0.008 - Math.random() * 0.003);
      ers = seg.brk > 0 ? Math.min(4, ers + 0.03) : Math.max(0, ers - 0.02);
      brkT = seg.brk > 50 ? Math.min(1050, brkT + 8 + Math.random() * 5) : Math.max(380, brkT - 3);
      tyreT = spd > 250 ? Math.min(110, tyreT + 0.3) : Math.max(72, tyreT - 0.2);
      setData({ spd, thr, brk, fuel, ers, brkT, tyreT });
      step++;
      if (step >= 15) { step = 0; idx = (idx + 1) % track.length; }
    }, 80);
    return () => clearInterval(iv);
  }, []);

  const gp = "text-[#ff44ff] [text-shadow:0_0_6px_#e500ff88,0_0_12px_#e500ff44]";
  const gc = "text-[#44eeff] [text-shadow:0_0_6px_#00e5ff88,0_0_12px_#00e5ff44]";
  const gd = "text-[#bb99cc] [text-shadow:0_0_4px_#e500ff33]";
  const align = side === "right" ? "text-right" : "";

  if (side === "left") {
    return (
      <div className={`border border-purple-primary/15 p-2.5 bg-purple-primary/[0.02] relative`} style={{ boxShadow: "0 0 10px rgba(229,0,255,0.03) inset" }}>
        <div className="absolute -bottom-px -left-px w-2 h-2 border-l-2 border-b-2 border-purple-primary" />
        <div className={`font-mono text-[9px] tracking-widest mb-1.5 ${gd}`}>TELEMETRY</div>
        <div className={`font-mono text-[22px] font-bold leading-tight ${gp}`}>{data.spd} <span className="text-xs">KPH</span></div>
        <div className={`font-mono text-xs mt-1 ${gd}`}>THROTTLE {data.thr}%</div>
        <div className={`font-mono text-xs ${data.brk > 0 ? gp : gd}`}>BRAKE {data.brk}%</div>
      </div>
    );
  }

  return (
    <div className={`border border-purple-primary/15 p-2.5 bg-purple-primary/[0.02] relative`} style={{ boxShadow: "0 0 10px rgba(229,0,255,0.03) inset" }}>
      <div className="absolute -bottom-px -right-px w-2 h-2 border-r-2 border-b-2 border-purple-primary" />
      <div className={`font-mono text-[9px] tracking-widest mb-1.5 ${gd} ${align}`}>PIT WALL</div>
      <div className={`font-mono text-xs ${align} ${gc}`}>FUEL {data.fuel.toFixed(1)} KG</div>
      <div className={`font-mono text-xs ${align} ${gc}`}>ERS {data.ers.toFixed(1)} MJ</div>
      <div className={`font-mono text-xs ${align} ${data.brkT > 800 ? gp : gc}`}>BRAKE {Math.round(data.brkT)}°C</div>
      <div className={`font-mono text-xs ${align} ${gd}`}>TYRE SURF {Math.round(data.tyreT)}°C</div>
    </div>
  );
}