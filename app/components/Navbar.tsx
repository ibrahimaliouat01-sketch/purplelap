"use client";

import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Thumbnails", href: "#thumbnails" },
  { label: "Who we are", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];
const NAVBAR_TRACK_SRC = "/audio/navbar-theme.mp3";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          let best = "";
          let bestRatio = 0;
          visible.forEach((ratio, key) => {
            if (ratio > bestRatio) { bestRatio = ratio; best = key; }
          });
          setActiveSection(best);
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: "-20% 0px -20% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(href: string) {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <div id="site-navbar" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-7xl" style={{ transition: "opacity 0.3s ease, transform 0.3s ease" }}>
      <nav
        className="relative overflow-hidden border border-purple-primary/20 bg-purple-primary/[0.03]"
        style={{
          clipPath: "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
          boxShadow: isScrolled
            ? "0 0 18px rgba(229,0,255,0.06) inset, 0 0 34px rgba(229,0,255,0.06)"
            : "0 0 15px rgba(229,0,255,0.05) inset, 0 0 30px rgba(229,0,255,0.03)",
          backdropFilter: isScrolled ? "blur(9px) saturate(72%) brightness(0.78)" : "blur(0px)",
          WebkitBackdropFilter: isScrolled ? "blur(9px) saturate(72%) brightness(0.78)" : "blur(0px)",
          transition: "backdrop-filter 280ms ease, -webkit-backdrop-filter 280ms ease, box-shadow 280ms ease",
        }}
      >
        <div
          className="absolute inset-0 z-[6] pointer-events-none"
          style={{
            background: isScrolled
              ? "radial-gradient(120% 150% at 50% 45%, rgba(255,255,255,0.015) 0%, rgba(12,4,22,0.5) 58%, rgba(6,2,11,0.78) 100%)"
              : "radial-gradient(120% 150% at 50% 45%, rgba(255,255,255,0.01) 0%, rgba(17,6,28,0.16) 64%, rgba(8,3,14,0.24) 100%)",
            transition: "background 280ms ease",
          }}
        />
        <div
          className="absolute inset-0 z-[7] pointer-events-none"
          style={{
            background: isScrolled
              ? "linear-gradient(180deg, rgba(5,2,10,0.6) 0%, rgba(14,6,23,0.18) 36%, rgba(14,6,23,0.18) 64%, rgba(5,2,10,0.6) 100%)"
              : "linear-gradient(180deg, rgba(5,2,10,0.22) 0%, rgba(14,6,23,0.06) 36%, rgba(14,6,23,0.06) 64%, rgba(5,2,10,0.22) 100%)",
            transform: isScrolled ? "scaleY(0.9)" : "scaleY(1)",
            transformOrigin: "center",
            transition: "transform 280ms ease, background 280ms ease",
          }}
        />
        <div className="absolute inset-0 z-[8] pointer-events-none hud-crt-scanlines" />
        <div className="absolute inset-0 z-[9] pointer-events-none hud-crt-flicker" />
        <div className="absolute inset-0 z-[9] pointer-events-none hud-crt-sweep" />
        <div className="absolute inset-0 z-10 pointer-events-none opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(229,0,255,0.08) 2px, rgba(229,0,255,0.08) 3px)" }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-stretch justify-between relative z-[20]">
          {/* Logo plaque */}
          <div className="relative h-full flex items-center self-stretch">
            <div
              className="h-full px-4 pr-2 flex items-center"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 42%, calc(100% - 6px) 100%, 0 100%, 9px 52%)" }}
            >
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="flex items-center h-full -translate-y-[1px] leading-none text-lg md:text-xl font-[family-name:var(--font-audiowide)] tracking-tight -skew-x-6 text-white cursor-pointer"
                style={{ textShadow: "0 0 6px rgba(255,255,255,0.35)", transition: "text-shadow 0.6s ease, filter 0.6s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 8px rgba(229,0,255,0.5))"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
              >
                purple<span className="text-purple-primary" style={{ textShadow: "0 0 8px rgba(229,0,255,0.65)", transition: "text-shadow 0.6s ease" }}>Lap</span>
              </a>
            </div>
            <img src="/favicon.png" alt="" className="w-11 h-11 object-contain opacity-90 ml-1 shrink-0" />
          </div>

          {/* Liens desktop */}
          <ul
            className="hidden md:flex items-stretch h-full text-sm flex-1 justify-center"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 40%, calc(100% - 5px) 100%, 0 100%, 8px 56%)" }}
          >
            {navLinks.map((link, i) => (
              <li key={link.href} className="h-full flex items-center relative">
                {i !== 0 && (
                  <div className="relative mx-2 w-[16px] h-14">
                    {/*
                      Reverse direction for the two left-most chevrons (i=1,2),
                      keep the others in the original direction.
                    */}
                    <div
                      className="w-[16px] h-14 bg-purple-primary/20"
                      style={{
                        clipPath:
                          i <= 2
                            ? "polygon(0 0, 66% 0, 100% 50%, 66% 100%, 0 100%, 28% 50%)"
                            : "polygon(34% 0, 100% 0, 72% 50%, 100% 100%, 34% 100%, 0 50%)",
                        boxShadow: "inset 0 0 0 1px rgba(229,0,255,0.25)",
                      }}
                    />
                  </div>
                )}
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="flex items-center h-full -translate-y-[1px] leading-none gap-2.5 px-4 lg:px-5 font-[family-name:var(--font-orbitron)] uppercase tracking-[0.16em] text-[11px] transition-colors duration-500 group cursor-pointer"
                  style={{ color: activeSection === link.href.slice(1) ? "var(--color-purple-light)" : "#e2d3ea" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse transition-all duration-500"
                    style={{
                      background: activeSection === link.href.slice(1) ? "var(--color-purple-primary)" : "white",
                      boxShadow: activeSection === link.href.slice(1)
                        ? "0 0 6px rgba(229,0,255,0.9), 0 0 14px rgba(229,0,255,0.5)"
                        : "0 0 5px rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.45)",
                      animationDuration: `${1 + i * 0.3}s`,
                    }}
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div
            className="hidden md:flex h-full items-center gap-2 -ml-2 border border-purple-primary/20 bg-purple-primary/[0.03] px-2 self-stretch"
            style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
          >
            <audio
              ref={audioRef}
              src={NAVBAR_TRACK_SRC}
              preload="none"
              onEnded={() => setIsPlaying(false)}
            />
            <button
              type="button"
              onClick={togglePlay}
              className="px-2 py-1 -translate-y-[1px] leading-none text-[10px] font-[family-name:var(--font-orbitron)] tracking-[0.15em] text-white border border-purple-primary/30"
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <div className="flex items-center gap-1.5 hud-volume-wrap -translate-y-[1px]">
              <span className="text-[#d4bddf] hud-volume-icon" aria-hidden="true">
                ♪
              </span>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="w-20 hud-volume hud-volume-blink"
              />
            </div>
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden text-[#d4bddf] hover:text-purple-light transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <ul className="md:hidden border-t border-purple-primary/20 bg-purple-primary/[0.03]">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                {i !== 0 && (
                  <div className="relative h-[8px] bg-purple-primary/20" style={{ clipPath: "polygon(0 0, 96% 0, 100% 50%, 96% 100%, 0 100%, 4% 50%)" }} />
                )}
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 px-6 py-3 font-[family-name:var(--font-orbitron)] uppercase tracking-[0.16em] text-[11px] transition-colors duration-500 cursor-pointer"
                  style={{ color: activeSection === link.href.slice(1) ? "var(--color-purple-light)" : "#d4bddf" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse transition-all duration-500"
                    style={{
                      background: activeSection === link.href.slice(1) ? "var(--color-purple-primary)" : "white",
                      boxShadow: activeSection === link.href.slice(1)
                        ? "0 0 6px rgba(229,0,255,0.9), 0 0 14px rgba(229,0,255,0.5)"
                        : "0 0 6px rgba(255,255,255,0.9)",
                      animationDuration: `${1 + i * 0.3}s`,
                    }}
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="pointer-events-none absolute inset-0 z-[60]">
        {/* Top-left corner */}
        <div className="absolute top-0 left-[14px] -translate-x-[1px] translate-y-[1px] w-3 h-3">
          <span className="absolute top-0 left-0 w-3 h-[2px] bg-purple-primary" />
          <span className="absolute top-0 left-0 w-[2px] h-3 bg-purple-primary rotate-[8deg] origin-top-left" />
        </div>

        {/* Top-right corner */}
        <div className="absolute top-0 right-0 -translate-x-[1px] translate-y-[1px] w-3 h-3">
          <span className="absolute top-0 right-0 w-3 h-[2px] bg-purple-primary" />
          <span className="absolute top-0 right-0 w-[2px] h-3 bg-purple-primary rotate-[8deg] origin-top-right" />
        </div>

        {/* Bottom-left corner */}
        <div className="absolute bottom-0 left-0 translate-x-[1px] -translate-y-[1px] w-3 h-3">
          <span className="absolute bottom-0 left-0 w-3 h-[2px] bg-purple-primary" />
          <span className="absolute bottom-0 left-0 w-[2px] h-3 bg-purple-primary rotate-[8deg] origin-bottom-left" />
        </div>

        {/* Bottom-right corner */}
        <div className="absolute bottom-0 right-[14px] translate-x-[1px] -translate-y-[1px] w-3 h-3">
          <span className="absolute bottom-0 right-0 w-3 h-[2px] bg-purple-primary" />
          <span className="absolute bottom-0 right-0 w-[2px] h-3 bg-purple-primary rotate-[8deg] origin-bottom-right" />
        </div>
      </div>
    </div>
  );
}