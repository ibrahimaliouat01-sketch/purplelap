"use client";

import { useEffect, useRef, useState } from "react";
import { VT323 } from "next/font/google";
import FadeIn from "./components/FadeIn";
import StaggerFade from "./components/StaggerFade";
import HudPanel from "./components/HudPanel";
import TelemetryPanel from "./components/TelemetryPanel";
import SpeedTrace from "./components/SpeedTrace";
import SectorBestLapPanel from "./components/SectorBestLapPanel";
import MechaFrame from "./components/MechaFrame";
import { SectionBgHud } from "./components/BackgroundHud";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });



const services = [
  { title: "Race Edits", description: "Cinematic highlights and aftermovies that capture every overtake, pit stop and podium moment.", icon: "🎬" },
  { title: "Social Content", description: "Short-form edits optimized for Instagram Reels, YouTube Shorts and TikTok. Built to perform.", icon: "📱" },
  { title: "Driver Profiles", description: "Personal brand videos for drivers and gentleman racers. Your story, your speed, your style.", icon: "🏁" },
  { title: "Team Promos", description: "Promotional content for teams, sponsors and events. Premium visuals that attract partnerships.", icon: "🏆" },
];

const heroEditBayLines = [
  { text: "TIMELINE::SYNCED", color: "purple" as const },
  { text: "CODEC::H.265 READY", color: "dim" as const },
  { text: "FPS::59.94 LOCKED", color: "purple" as const },
];

const heroCamFeedLines = [
  { text: "CAM::ONBOARD-01", color: "dim" as const },
  { text: "AUDIO::5.1 MAPPED", color: "cyan" as const },
];

const heroRaceCtrlLines = [
  { text: "GRID::P1", color: "purple" as const },
  { text: "SECTOR::PURPLE", color: "purple" as const },
  { text: "TYRE::SOFT", color: "dim" as const },
];

const heroExportLines = [
  { text: "RENDER::GPU ACTIVE", color: "dim" as const },
  { text: "EXPORT::PRORES 4444", color: "cyan" as const },
];

export default function Home() {
  const [heroParallax, setHeroParallax] = useState(0);
  const [selectedThumb, setSelectedThumb] = useState<number | null>(null);
  const [openSound, setOpenSound] = useState(false);
  const [openCinematic, setOpenCinematic] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoVolume, setVideoVolume] = useState(0.5);
  const [screenOffset, setScreenOffset] = useState({ x: 0, y: 0 });
  const [activeDrag, setActiveDrag] = useState<"screen" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragOrigin = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const MAX_GAIN = 6;

  function ensureAudioCtx() {
    const vid = videoRef.current;
    if (!vid || audioCtxRef.current) return;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(vid);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(gain);
    gain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    gainRef.current = gain;
  }

  function toggleVideoPlay() {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setVideoPaused(false);
    } else {
      vid.pause();
      setVideoPaused(true);
    }
  }

  function toggleVideoSound() {
    const vid = videoRef.current;
    if (!vid) return;
    ensureAudioCtx();
    if (vid.paused) vid.play().catch(() => {});
    if (videoMuted) {
      vid.muted = false;
      if (gainRef.current) gainRef.current.gain.value = videoVolume * MAX_GAIN;
      setVideoMuted(false);
    } else {
      if (gainRef.current) gainRef.current.gain.value = 0;
      vid.muted = true;
      setVideoMuted(true);
    }
  }

  function startDrag(e: React.MouseEvent) {
    dragOrigin.current = { mx: e.clientX, my: e.clientY, ox: screenOffset.x, oy: screenOffset.y };
    setActiveDrag("screen");
    e.preventDefault();
  }

  useEffect(() => {
    if (!activeDrag) return;
    function onMouseMove(e: MouseEvent) {
      const hero = heroRef.current;
      const maxX = hero ? hero.offsetWidth * 0.3 : 350;
      const maxY = hero ? hero.offsetHeight * 0.25 : 180;
      setScreenOffset({
        x: Math.max(-maxX, Math.min(maxX, dragOrigin.current.ox + e.clientX - dragOrigin.current.mx)),
        y: Math.max(-maxY, Math.min(maxY, dragOrigin.current.oy + e.clientY - dragOrigin.current.my)),
      });
    }
    function onMouseUp() { setActiveDrag(null); }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeDrag]);

  function handleVideoVolume(v: number) {
    const vid = videoRef.current;
    setVideoVolume(v);
    if (!vid) return;
    if (v === 0) {
      if (gainRef.current) gainRef.current.gain.value = 0;
      vid.muted = true;
      setVideoMuted(true);
    } else {
      ensureAudioCtx();
      vid.muted = false;
      if (gainRef.current) gainRef.current.gain.value = v * MAX_GAIN;
      setVideoMuted(false);
    }
  }



  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHeroParallax(Math.min(y, 600));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function applyDepth() {
      document.querySelectorAll<HTMLElement>("main > section").forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0) {
          section.style.transform = "";
          section.style.opacity = "";
          return;
        }
        const progress = Math.min(Math.abs(rect.top) / (window.innerHeight * 0.75), 1);
        const scale = (1 - progress * 0.1).toFixed(4);
        const tz = (-progress * 160).toFixed(1);
        const opacity = (1 - progress * 0.5).toFixed(4);
        section.style.transform = `scale(${scale}) translateZ(${tz}px)`;
        section.style.opacity = opacity;
      });
    }
    window.addEventListener("scroll", applyDepth, { passive: true });
    return () => window.removeEventListener("scroll", applyDepth);
  }, []);

  useEffect(() => {
    if (selectedThumb !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedThumb]);

  return (
    <>
    {/* Lightbox */}
    {selectedThumb !== null && (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={() => setSelectedThumb(null)}
      >
        <button
          className="absolute top-5 right-6 text-white/60 hover:text-white font-[family-name:var(--font-orbitron)] text-xs tracking-widest transition-colors"
          onClick={() => setSelectedThumb(null)}
        >
          ✕ CLOSE
        </button>
        <img
          src={`/thumbnail${selectedThumb}.jpg`}
          alt={`Thumbnail ${selectedThumb}`}
          className="max-w-[92vw] max-h-[92vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
    <main style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(229,0,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(229,0,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">

        {/* Background screen */}
        <div
          className="hidden md:flex absolute inset-0 items-center justify-center z-0 pointer-events-none"
          style={{ transform: `translate3d(${screenOffset.x}px, ${heroParallax * 0.38 + screenOffset.y}px, 0)`, willChange: "transform" }}
        >
          {/* Stable wrapper — explicit width centers in flex, anchors absolute children */}
          <div className="relative w-[75vw] max-w-5xl">
            {/* Drag handle — top right, outside shake */}
            <div
              onMouseDown={startDrag}
              className="absolute right-0 -top-7 z-20 flex items-center gap-1.5 px-2 py-1 border border-purple-primary/30 pointer-events-auto select-none"
              style={{ cursor: activeDrag === "screen" ? "grabbing" : "grab" }}
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="text-purple-primary/60">
                <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor"/><circle cx="7.5" cy="2.5" r="1.5" fill="currentColor"/>
                <circle cx="2.5" cy="7" r="1.5" fill="currentColor"/><circle cx="7.5" cy="7" r="1.5" fill="currentColor"/>
                <circle cx="2.5" cy="11.5" r="1.5" fill="currentColor"/><circle cx="7.5" cy="11.5" r="1.5" fill="currentColor"/>
              </svg>
              <span className="text-[9px] font-[family-name:var(--font-orbitron)] tracking-[0.15em] text-purple-primary/50 uppercase">DRAG</span>
            </div>
            {/* Shake wrapper */}
            <div className="hud-speed-shake-sm w-full">
              <MechaFrame className="w-full">
                <div className="absolute -top-6 left-0 font-mono text-[9px] tracking-[0.2em] text-purple-primary/50 uppercase z-10">CAM::RACE-FEED-01</div>
                <div className="absolute -bottom-6 right-0 font-mono text-[9px] tracking-[0.2em] text-purple-primary/40 uppercase flex items-center gap-3 z-10">
                  <span className="text-purple-primary/30 normal-case tracking-normal">© Rebellion Racing</span>
                  REC ●
                </div>
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <div
                    className="absolute inset-0 border border-purple-primary/25 z-10"
                    style={{ boxShadow: "0 0 60px rgba(229,0,255,0.08) inset, 0 0 80px rgba(229,0,255,0.05)" }}
                  />
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-50"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{ filter: "sepia(1) hue-rotate(220deg) saturate(2) brightness(0.55)" }}
                  >
                    <source src="/footage/gt3-onboard-compressed.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0" style={{ background: "rgba(120,0,180,0.18)", mixBlendMode: "screen" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(12,4,24,0.55) 0%, rgba(12,4,24,0.05) 35%, rgba(12,4,24,0.05) 65%, rgba(12,4,24,0.65) 100%)" }} />
                  <div className="absolute inset-0 pointer-events-none hud-crt-scanlines" />
                  <div className="absolute inset-0 pointer-events-none hud-crt-flicker" />
                  <div className="absolute inset-0 pointer-events-none hud-crt-sweep" />
                  <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(229,0,255,0.08) 2px, rgba(229,0,255,0.08) 3px)" }} />
                </div>
              </MechaFrame>
            </div>
            {/* Video controls */}
            <div className="absolute left-0 top-full mt-2 flex items-center gap-3 pointer-events-auto">
              <button
                type="button"
                onClick={toggleVideoPlay}
                className="px-2 py-1 leading-none text-[10px] font-[family-name:var(--font-orbitron)] tracking-[0.15em] text-white border border-purple-primary/30 uppercase cursor-pointer"
              >
                {videoPaused ? "▶ PLAY" : "⏸ PAUSE"}
              </button>
              <button
                type="button"
                onClick={toggleVideoSound}
                className="w-[84px] h-[26px] px-2 leading-none text-[10px] font-[family-name:var(--font-orbitron)] tracking-[0.15em] text-white border border-purple-primary/30 uppercase cursor-pointer text-center"
              >
                {videoMuted ? "SOUND ON" : "MUTE"}
              </button>
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <span className="text-[#d4bddf] text-xs">♪</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={videoMuted ? 0 : videoVolume}
                  onChange={(e) => handleVideoVolume(Number(e.target.value))}
                  aria-label="Video volume"
                  className="w-20 hud-volume hud-volume-blink"
                />
              </div>
            </div>
            {/* Floor glow — anchored below screen */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: "calc(100% - 10px)",
                height: "80px",
                background: "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(229,0,255,0.6) 0%, rgba(229,0,255,0.2) 40%, transparent 70%)",
                filter: "blur(16px)",
              }}
            />
          </div>
        </div>

        {/* Left panels — absolute, pushed to edge */}
        <div
          className="hidden md:flex flex-col gap-3 absolute left-[7%] top-[65%] -translate-y-1/2 z-10 w-40"
          style={{ transform: `perspective(800px) rotateY(10deg) translate3d(0, calc(-50% + ${heroParallax * 0.08}px), 120px)`, transformOrigin: "right center", willChange: "transform" }}
        >
          <div className="hud-speed-shake flex flex-col gap-3">
            <StaggerFade delay={400}><HudPanel label="EDIT BAY 01" lines={heroEditBayLines} /></StaggerFade>
            <StaggerFade delay={700}><TelemetryPanel side="left" /></StaggerFade>
            <StaggerFade delay={1000}><HudPanel label="CAM FEED" lines={heroCamFeedLines} className="border-purple-primary/10" /></StaggerFade>
          </div>
        </div>


        {/* Right panels — absolute, pushed to edge */}
        <div
          className="hidden md:flex flex-col gap-3 absolute right-[7%] top-[72%] -translate-y-1/2 z-10 w-40"
          style={{ transform: `perspective(800px) rotateY(-10deg) translate3d(0, calc(-50% + ${heroParallax * 0.08}px), 120px)`, transformOrigin: "left center", willChange: "transform" }}
        >
          <div className="hud-speed-shake flex flex-col gap-3">
            <StaggerFade delay={400}><HudPanel label="RACE CTRL" align="right" lines={heroRaceCtrlLines} /></StaggerFade>
            <StaggerFade delay={700}><TelemetryPanel side="right" /></StaggerFade>
            <StaggerFade delay={1000}><HudPanel label="EXPORT" align="right" lines={heroExportLines} className="border-purple-primary/10" /></StaggerFade>
          </div>
        </div>


        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <div className="flex justify-center md:px-5">
            <div
              className="flex flex-col items-center justify-center py-10 md:py-0"
              style={{ transform: `translate3d(0, ${heroParallax * 0.06}px, 0)`, willChange: "transform" }}
            >
              <StaggerFade delay={100}>
                <div className="relative inline-block">
                  <div className="absolute -top-3 -left-5 w-4 h-4 border-l border-t border-purple-primary/50" />
                  <div className="absolute -top-3 -right-5 w-4 h-4 border-r border-t border-purple-primary/50" />
                  <div className="absolute -bottom-3 -left-5 w-4 h-4 border-l border-b border-purple-primary/50" />
                  <div className="absolute -bottom-3 -right-5 w-4 h-4 border-r border-b border-purple-primary/50" />
                  <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-audiowide)] tracking-tight -skew-x-6 px-6 py-2">
                    purple<span className="text-purple-primary">Lap</span>
                  </h1>
                </div>
              </StaggerFade>
              <StaggerFade delay={300}><p className="mt-4 text-text-gray text-xs md:text-sm font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em]">Motorsport Media Management</p></StaggerFade>
              <StaggerFade delay={500}><a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-block mt-8 px-8 py-3 border border-purple-primary text-purple-primary text-xs font-mono uppercase tracking-widest hover:bg-purple-primary hover:text-white transition-all duration-200 cursor-pointer">Work with us</a></StaggerFade>
              <StaggerFade delay={900}>
                <div className="mt-6 flex flex-col md:flex-row items-center gap-3">
                  <SpeedTrace />
                  <SectorBestLapPanel />
                </div>
              </StaggerFade>
              <StaggerFade delay={1300}>
                <a
                  href="#showreel"
                  onClick={(e) => { e.preventDefault(); document.getElementById("showreel")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="mt-4 inline-block border border-[#44ff8855] hover:border-[#44ff88] transition-colors duration-300 cursor-pointer"
                  style={{ boxShadow: "0 0 8px rgba(68,255,136,0.1) inset, 0 0 20px rgba(68,255,136,0.08)" }}
                >
                  <span
                    className="flex items-center gap-3 px-5 py-1.5 animate-pulse"
                    style={{
                      background: "linear-gradient(180deg, rgba(68,255,136,0.3), rgba(68,255,136,0.14))",
                      boxShadow: "inset 0 0 10px rgba(68,255,136,0.32), 0 0 14px rgba(68,255,136,0.2)",
                      animationDuration: "1.8s",
                    }}
                  >
                    <span className={`${vt323.className} text-lg leading-none tracking-[0.2em] text-[#8affbc] [text-shadow:0_0_4px_rgba(138,255,188,0.35),0_1px_0_rgba(14,44,28,0.35)]`}>
                      ALL SYSTEMS GO
                    </span>
                    <span className={`${vt323.className} text-lg leading-none text-[#8affbc] [text-shadow:0_0_4px_rgba(138,255,188,0.35),0_1px_0_rgba(14,44,28,0.35)]`}>
                      -
                    </span>
                    <span className={`${vt323.className} text-lg leading-none tracking-[0.2em] text-[#8affbc] [text-shadow:0_0_4px_rgba(138,255,188,0.35),0_1px_0_rgba(14,44,28,0.35)]`}>
                      START SHOWREEL WATCH
                    </span>
                  </span>
                </a>
              </StaggerFade>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="py-24 px-6 relative">
        <SectionBgHud side="left" label="LAP LOG" lines={[{ text: "LAP 41::1:32.441" }, { text: "LAP 42::1:31.998" }, { text: "LAP 43::1:32.205" }]} verticalPosition="top" offset="1rem" />
        <SectionBgHud side="right" label="SECTOR TIME" lines={[{ text: "S1::23.847" }, { text: "S2::28.112" }, { text: "S3::25.908" }]} verticalPosition="bottom" offset="7rem" />
        <FadeIn>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em] text-purple-primary mb-12 text-center">Selected Work</h2>

            {/* Video cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sound Design */}
              <div className="flex flex-col gap-4">
                <p className="font-mono text-[10px] tracking-widest text-[#ff44ff] [text-shadow:0_0_6px_#e500ff88] uppercase">Sound Design</p>
                <div className="aspect-video border border-purple-primary/15 overflow-hidden" style={{ boxShadow: "0 0 12px rgba(229,0,255,0.06) inset" }}>
                  <iframe
                    src="https://www.youtube.com/embed/csscOwQ-cqo"
                    title="Sound Design"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-purple-primary/30 font-mono text-[9px] text-right">© Porsche Motorsports</p>
                <button
                  onClick={() => setOpenSound(!openSound)}
                  className="flex items-center gap-2 text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.2em] text-purple-primary/60 hover:text-purple-primary transition-colors duration-200 cursor-pointer"
                >
                  <span className="transition-transform duration-300" style={{ transform: openSound ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  Process
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: openSound ? "600px" : "0px", opacity: openSound ? 1 : 0 }}
                >
                  <div className="border-t border-purple-primary/10 pt-4">
                    <p className="text-text-gray text-sm leading-relaxed">
                      As a big fan of the Porsche brand and Porsche racing cars, I decided to remake all of the sound design for one of their promo clips showcasing the incredible race they have had in 2025 at the 24 Hours of Le Mans. I thought the sound design of the original promo clip, <span className="text-[#d4bddf] italic">"One step closer to infinity | Porsche 963 at the 24 Hours of Le Mans 2025"</span> was technically good but lacked acute knowledge of the way a race works. For example at the beginning of the original video clip you can clearly hear the same AI voice acting as a race engineer and the race director at the same time. The kind of details a true motorsport fan immediately notice and that can make all the difference.
                      <br /><br />
                      I believe with this remake, that I managed to really capture all of the vibes and emotions which come with endurance racing, thus highlighting the importance of good sound design in a piece of motorsports related work and above all how important it is to have true passionate people to handle the creative process behind a racing organisation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cinematic Edits */}
              <div className="flex flex-col gap-4">
                <p className="font-mono text-[10px] tracking-widest text-[#ff44ff] [text-shadow:0_0_6px_#e500ff88] uppercase">Cinematic Edits</p>
                <div className="aspect-video border border-purple-primary/15 overflow-hidden" style={{ boxShadow: "0 0 12px rgba(229,0,255,0.06) inset" }}>
                  <iframe
                    src="https://www.youtube.com/embed/P5LopBCu_BI"
                    title="Cinematic Edits"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <button
                  onClick={() => setOpenCinematic(!openCinematic)}
                  className="flex items-center gap-2 text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.2em] text-purple-primary/60 hover:text-purple-primary transition-colors duration-200 cursor-pointer"
                >
                  <span className="transition-transform duration-300" style={{ transform: openCinematic ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  About
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: openCinematic ? "400px" : "0px", opacity: openCinematic ? 1 : 0 }}
                >
                  <div className="border-t border-purple-primary/10 pt-4">
                    <p className="text-text-gray text-sm leading-relaxed">
                      A song will suffice — I love Ferrari, a love maybe irrational but it never quite is. In this short cinematic edit, we wanted to pay hommage to one of if not the most iconic car brand in the world. We browsed through hours of footage to find the picture perfect frames we wanted to showcase, and added a slight nostalgic touch with the visual effects.
                      <br /><br />
                      <span className="text-[#d4bddf]">PS :</span> I love the 458 Speciale
                      <br />
                      <span className="text-[#d4bddf]">PS2 :</span> Footage seen in the video doesn&apos;t belong to us, all credit goes to the original owners.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* Thumbnails */}
      <section id="thumbnails" className="py-24 px-6 relative">
        <FadeIn>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em] text-purple-primary mb-12 text-center">Thumbnails</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  type="button"
                  className="border border-purple-primary/15 overflow-hidden w-full group relative cursor-pointer"
                  style={{ aspectRatio: "16/9", boxShadow: "0 0 12px rgba(229,0,255,0.03) inset" }}
                  onClick={() => setSelectedThumb(i)}
                >
                  <img
                    src={`/thumbnail${i}.jpg`}
                    alt={`Thumbnail ${i}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-[family-name:var(--font-orbitron)] text-[10px] tracking-widest text-white border border-white/40 px-3 py-1.5">
                      VIEW
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Vertical Content */}
      <section className="py-24 px-6 relative">
        <FadeIn>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em] text-purple-primary mb-12 text-center">Vertical Content</h2>
            <div className="flex flex-col gap-10">
              {/* Top card — YouTube Short */}
              <div className="flex justify-center">
                <div className="border border-purple-primary/15 overflow-hidden w-full max-w-lg" style={{ aspectRatio: "1/1", boxShadow: "0 0 12px rgba(229,0,255,0.03) inset" }}>
                  <iframe
                    src="https://www.youtube.com/embed/3xqiWW8anxQ"
                    title="Vertical Content"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
              {/* YouTube Shorts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">
                <div className="flex justify-center">
                  <div className="border border-purple-primary/15 overflow-hidden w-full" style={{ aspectRatio: "9/16", boxShadow: "0 0 12px rgba(229,0,255,0.03) inset" }}>
                    <iframe
                      src="https://www.youtube.com/embed/yjfGwduC1DA"
                      title="Vertical Content"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="border border-purple-primary/15 overflow-hidden w-full" style={{ aspectRatio: "9/16", boxShadow: "0 0 12px rgba(229,0,255,0.03) inset" }}>
                    <iframe
                      src="https://www.youtube.com/embed/djHhfoEFZco"
                      title="Vertical Content"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Showreel */}
      <section id="showreel" className="py-24 px-6 relative">
        <SectionBgHud side="left" label="MAGI-01" lines={[{ text: "STATUS::ONLINE" }, { text: "SYNC::98.2%" }, { text: "LINK::STABLE" }]} verticalPosition="top" offset="6rem" />
        <SectionBgHud side="right" label="BROADCAST" lines={[{ text: "FEED::LIVE" }, { text: "BITRATE::50MBPS" }, { text: "CODEC::H.265" }]} verticalPosition="bottom" offset="1rem" />
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em] text-purple-primary mb-6">Showreel</h2>
            <MechaFrame>
              <div className="aspect-video bg-purple-primary/[0.02] border border-purple-primary/20 flex flex-col items-center justify-center" style={{ boxShadow: "0 0 20px rgba(229,0,255,0.05) inset" }}>
                <div className="w-14 h-14 rounded-full border-2 border-purple-primary flex items-center justify-center mb-4" style={{ boxShadow: "0 0 12px rgba(229,0,255,0.3)" }}>
                  <div className="w-0 h-0 border-l-[14px] border-l-purple-primary border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1" />
                </div>
                <span className="font-mono text-xs tracking-widest text-[#bb99cc] [text-shadow:0_0_4px_#e500ff33]">COMING SOON</span>
              </div>
            </MechaFrame>
          </div>
        </FadeIn>
      </section>

      {/* Modal Backdrop */}
      {/* About */}
      <section id="about" className="py-24 px-6 relative">
        <SectionBgHud side="left" label="COLOR GRADE" lines={[{ text: "LUT::ARRI LOG-C" }, { text: "EXPOSURE::+0.3" }, { text: "WB::5600K" }]} verticalPosition="top" offset="8rem" />
        <SectionBgHud side="right" label="AUDIO MIX" lines={[{ text: "LEVEL::-6dB" }, { text: "ENGINE::ISOLATED" }, { text: "SFX::MUTED" }]} verticalPosition="bottom" offset="1rem" />
        <FadeIn>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em] text-purple-primary mb-12 text-center">Who we are</h2>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="relative shrink-0">
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-purple-primary z-10" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-purple-primary z-10" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-purple-primary z-10" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-purple-primary z-10" />
                <div className="w-48 h-48 overflow-hidden border border-purple-primary/30" style={{ boxShadow: "0 0 20px rgba(229,0,255,0.15)" }}>
                  <img src="/profile.png" alt="purpleLap" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <p className="text-text-gray leading-relaxed">purpleLap is a media management studio built for motorsport. From raw onboard footage to cinematic race edits, we craft visual content that captures the speed, precision and emotion of racing. Our pledge : to help drivers and organisations thrive and do what they do best by allowing them not to worry about the media side of things anymore, and entrusting all of the heavy processes that go behind media management to seasoned professionals.</p>
                <div className="flex flex-wrap gap-3 mt-6">
                  {["Premiere Pro", "After Effects", "Blender", "F1 / GT / WEC / Karting"].map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 border border-purple-primary/15 text-text-gray font-mono">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6 relative">
        <SectionBgHud side="left" label="RENDER QUEUE" lines={[{ text: "JOB 01::84%" }, { text: "JOB 02::PENDING" }, { text: "JOB 03::DONE" }]} verticalPosition="top" offset="1rem" />
        <SectionBgHud side="right" label="STORAGE" lines={[{ text: "RAID::4.2TB FREE" }, { text: "ARCHIVE::STABLE" }, { text: "BACKUP::SYNCED" }]} verticalPosition="bottom" offset="9rem" />
        <FadeIn>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em] text-purple-primary mb-12 text-center">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, i) => (
                <div key={i} className="p-6 border border-purple-primary/10 bg-purple-primary/[0.02] hover:border-purple-primary/30 transition-colors duration-300" style={{ boxShadow: "0 0 10px rgba(229,0,255,0.03) inset" }}>
                  <span className="text-3xl mb-4 block">{service.icon}</span>
                  <h3 className="text-white text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-text-gray text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 relative">
        <SectionBgHud side="left" label="UPLINK" lines={[{ text: "CHANNEL::SECURE" }, { text: "LATENCY::12ms" }]} verticalPosition="center" offset="5rem" />
        <SectionBgHud side="right" label="INBOX" lines={[{ text: "MESSAGES::READY" }, { text: "PRIORITY::HIGH" }]} verticalPosition="center" offset="5rem" />
        <FadeIn>
          <div className="max-w-xl mx-auto text-center relative z-10">
            <h2 className="text-xs font-[family-name:var(--font-orbitron)] uppercase tracking-[0.3em] text-purple-primary mb-4">Contact</h2>
            <p className="text-text-gray mb-10">Have a project in mind? Let&apos;s talk.</p>
            <a href="https://wa.me/33767458917" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 border border-purple-primary/50 text-purple-primary/80 text-xs font-mono uppercase tracking-widest hover:bg-purple-primary hover:text-white hover:border-purple-primary transition-all duration-200 mb-4">WhatsApp +33 7 67 45 89 17</a>
            <br />
            <a href="mailto:purplelapmedia@proton.me" className="inline-block px-8 py-3 border border-purple-primary text-purple-primary text-xs font-mono uppercase tracking-widest hover:bg-purple-primary hover:text-white transition-all duration-200">purplelapmedia@proton.me</a>
            <div className="flex justify-center gap-6 mt-10">
              <a href="https://www.instagram.com/purplelap.media/" target="_blank" rel="noopener noreferrer" className="text-text-gray hover:text-purple-primary transition-colors duration-200 font-mono text-sm">Instagram</a>
              <a href="https://www.youtube.com/@purpleLapMedia" target="_blank" rel="noopener noreferrer" className="text-text-gray hover:text-purple-primary transition-colors duration-200 font-mono text-sm">YouTube</a>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>

    </>
  );
}