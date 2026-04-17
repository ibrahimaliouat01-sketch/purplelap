"use client";

import { useEffect, useState } from "react";

const sectors = [
  { name: "S1", value: "23.847" },
  { name: "S2", value: "28.112" },
  { name: "S3", value: "25.908" },
];

export default function SectorBestLapPanel() {
  const [activeSector, setActiveSector] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setActiveSector((prev) => (prev + 1) % sectors.length);
    }, 1800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="w-full max-w-[240px] h-[65px] border border-purple-primary/15 relative bg-purple-primary/[0.02] px-2 py-1.5"
      style={{ boxShadow: "0 0 12px rgba(229,0,255,0.04) inset" }}
    >
      <span className="absolute top-1 left-2 font-mono text-[9px] tracking-widest text-[#bb99cc] [text-shadow:0_0_4px_#e500ff33]">
        BEST LAP SECTORS
      </span>

      <div className="mt-4.5 flex items-end justify-between gap-1.5">
        {sectors.map((sector, idx) => {
          const isActive = idx === activeSector;
          return (
            <div key={sector.name} className="flex-1">
              <div
                className={`h-4 border transition-all duration-700 ${
                  isActive ? "border-purple-light bg-purple-primary/40" : "border-purple-primary/25 bg-purple-primary/10"
                }`}
                style={{
                  boxShadow: isActive ? "0 0 12px rgba(229,0,255,0.45), inset 0 0 8px rgba(229,0,255,0.3)" : "none",
                }}
              />
              <div className="mt-0.5 flex items-center justify-between font-mono text-[8px] text-[#bb99cc]">
                <span className={isActive ? "text-[#ff66ff]" : ""}>{sector.name}</span>
                <span className={isActive ? "text-[#ff66ff]" : ""}>{sector.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
