"use client";

import { useState, useEffect, useRef } from "react";
import { VT323 } from "next/font/google";
import Link from "next/link";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

const sections = [
  { id: "palette", label: "01 — Palette" },
  { id: "logo", label: "02 — Logo" },
  { id: "typo", label: "03 — Typographie" },
  { id: "composants", label: "04 — Composants" },
  { id: "ton", label: "05 — Ton" },
  { id: "checklist", label: "06 — Checklist" },
];

const colorGroups = [
  {
    label: "Fonds",
    colors: [
      { hex: "#0c0418", variable: "bg-primary", usage: "Fond principal, navbar" },
      { hex: "#0a0218", variable: "bg-secondary", usage: "Fond section, alternance" },
      { hex: "#1a0a2e", variable: "bg-card", usage: "Cards, blocs contenu" },
    ],
  },
  {
    label: "Violet — Accent principal",
    colors: [
      { hex: "#2a0040", variable: "accent-dim", usage: "Fonds discrets, panneaux HUD" },
      { hex: "#e500ff", variable: "accent", usage: "Boutons pleins, CTA, bordures actives" },
      { hex: "#ff44ff", variable: "accent-bright", usage: 'Liens, survols, logo "Lap", labels' },
    ],
  },
  {
    label: "Cyan HUD — Accent secondaire",
    colors: [
      { hex: "#6bc9ff", variable: "hud-cyan", usage: "Textes données techniques, écrans HUD de fond" },
    ],
  },
  {
    label: "Vert Status",
    colors: [
      { hex: "#44ff88", variable: "status-green", usage: 'Voyants actifs, "ALL SYSTEMS GO", indicateur "LIVE"' },
    ],
  },
  {
    label: "Texte",
    colors: [
      { hex: "#ffffff", variable: "text-primary", usage: "Titres, texte fort" },
      { hex: "#bb99cc", variable: "text-secondary", usage: "Corps, descriptions" },
      { hex: "#8a8a9a", variable: "text-dim", usage: "Métadonnées, légendes" },
    ],
  },
  {
    label: "Bordures & Utilitaires",
    colors: [
      { hex: "rgba(229,0,255,0.3)", variable: "border-brand", usage: "Bordures cards, cadres actifs" },
      { hex: "rgba(229,0,255,0.04)", variable: "grid-line", usage: "Grille technique de fond de page" },
    ],
  },
];

const checklistItems = [
  "Un team manager comprendrait-il chaque phrase ?",
  "L'email purplelapmedia@proton.me est-il visible ?",
  "Y a-t-il du jargon tech quelque part ?",
  "Les exemples sont-ils concrets (course, équipe, vidéo) ?",
  "Le site marche bien sur mobile ?",
  "Les couleurs sont-elles cohérentes avec la palette (violet, pas bleu) ?",
  "La grille technique est-elle visible mais discrète en fond ?",
  "Les coins mecha sont-ils présents sur les cards/cadres ?",
  "Le ton est-il direct et pro sans être distant ?",
  "Les écrans HUD sont-ils lisibles et pas trop chargés ?",
];

function ColorSwatch({ hex, variable, usage }: { hex: string; variable: string; usage: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  const isRgba = hex.startsWith("rgba");
  return (
    <div className="flex flex-col gap-2 cursor-pointer group" onClick={copy} title="Copier">
      <div
        className="h-16 rounded-sm border border-white/10 transition-transform duration-150 group-hover:scale-[1.02]"
        style={{ background: hex }}
      />
      <div className="flex justify-between items-start gap-2">
        <span className="font-mono text-[11px] text-white">{copied ? "Copié !" : hex}</span>
        <span className="font-mono text-[11px] text-[#8a8a9a] text-right">{variable}</span>
      </div>
      <p className="text-[#8a8a9a] text-xs leading-relaxed">{usage}</p>
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; label?: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="w-8 h-8 rounded-full border border-[#e500ff]/40 flex items-center justify-center font-mono text-xs text-[#e500ff]">{number}</span>
      <h2 className="font-[family-name:var(--font-orbitron)] text-xl font-medium tracking-wide text-white">{title}</h2>
      <div className="flex-1 h-px bg-[#e500ff]/10" />
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#1a0a2e] border border-[#e500ff]/15 p-5 relative ${className}`}>
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-l border-t border-[#e500ff]/40" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-r border-t border-[#e500ff]/40" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-l border-b border-[#e500ff]/40" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-r border-b border-[#e500ff]/40" />
      {children}
    </div>
  );
}

export default function BrandingPage() {
  const [activeSection, setActiveSection] = useState("palette");
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[#0c0418] text-white" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(229,0,255,0.03) 39px, rgba(229,0,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(229,0,255,0.03) 39px, rgba(229,0,255,0.03) 40px)" }}>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-[#080214] border-r border-[#e500ff]/10 z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-[#e500ff]/10">
          <Link href="/" className="flex items-center gap-1.5 mb-3 text-sm hover:opacity-80 transition-opacity">
            <span className="text-[#8a8a9a] font-mono text-xs">←</span>
            <span className="font-mono text-xs text-[#8a8a9a]">Retour au site</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-audiowide)] text-base -skew-x-6 inline-block">
              purple<span style={{ color: "#e500ff" }}>Lap</span>
            </span>
          </div>
          <span className="mt-1.5 inline-block text-[10px] font-mono tracking-widest px-2 py-0.5 border border-[#e500ff]/30 text-[#e500ff] uppercase">Brand Book</span>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`w-full text-left px-6 py-2.5 text-xs font-mono tracking-wide transition-colors duration-200 border-l-2 ${
                activeSection === id
                  ? "text-[#e500ff] border-[#e500ff] bg-[#e500ff]/5"
                  : "text-[#8a8a9a] border-transparent hover:text-[#bb99cc]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-[#e500ff]/10">
          <p className="text-[10px] font-mono text-[#8a8a9a]">Usage interne uniquement</p>
        </div>
      </aside>

      {/* Main */}
      <main ref={mainRef} className="lg:ml-56 px-6 md:px-12 py-16 max-w-5xl">

        {/* Mobile header */}
        <div className="lg:hidden mb-10 flex items-center justify-between">
          <div>
            <span className="font-[family-name:var(--font-audiowide)] text-lg -skew-x-6 inline-block">
              purple<span style={{ color: "#e500ff" }}>Lap</span>
            </span>
            <span className="ml-2 text-[10px] font-mono tracking-widest px-2 py-0.5 border border-[#e500ff]/30 text-[#e500ff] uppercase">Brand Book</span>
          </div>
          <Link href="/" className="font-mono text-xs text-[#8a8a9a] hover:text-white transition-colors">← Retour</Link>
        </div>

        {/* ── 01 PALETTE ── */}
        <section id="palette" className="mb-20 scroll-mt-8">
          <SectionTitle number="01" title="Palette" />

          <Card className="mb-10">
            <p className="text-xs font-mono tracking-widest text-[#e500ff] uppercase mb-3">Concept</p>
            <p className="text-[#bb99cc] text-sm leading-relaxed mb-3">
              purpleLap emprunte son nom au <span className="text-white">tour violet</span> en F1 — quand un pilote signe le meilleur temps absolu en qualifications. La marque fusionne les codes visuels du broadcast motorsport (HUD, télémétrie, scanlines CRT) avec l'esthétique mecha d'Evangelion pour parler à une audience qui reconnaît ce langage.
            </p>
            <p className="text-[#bb99cc] text-sm leading-relaxed">
              <span className="text-[#e500ff]">Violet</span> = accent principal, <span className="text-[#6bc9ff]">cyan</span> = données techniques uniquement, <span className="text-[#44ff88]">vert</span> = confirmations et statuts actifs. Pas de bleu corporate.
            </p>
          </Card>

          <div className="space-y-10">
            {colorGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-mono tracking-widest text-[#8a8a9a] uppercase mb-4">{group.label}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {group.colors.map((c) => (
                    <ColorSwatch key={c.variable} {...c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 02 LOGO ── */}
        <section id="logo" className="mb-20 scroll-mt-8">
          <SectionTitle number="02" title="Logo & Identité visuelle" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-mono text-[#8a8a9a] mb-3">Sur fond sombre</p>
              <div className="bg-[#0c0418] border border-[#e500ff]/15 p-10 flex items-center justify-center">
                <span className="font-[family-name:var(--font-audiowide)] text-3xl -skew-x-6 inline-block" style={{ textShadow: "0 0 6px rgba(255,255,255,0.25)" }}>
                  purple<span style={{ color: "#e500ff", textShadow: "0 0 8px rgba(229,0,255,0.65)" }}>Lap</span>
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-[#8a8a9a] mb-3">Sur fond clair</p>
              <div className="bg-white border border-[#e500ff]/15 p-10 flex items-center justify-center">
                <span className="font-[family-name:var(--font-audiowide)] text-3xl -skew-x-6 inline-block text-[#0c0418]">
                  purple<span style={{ color: "#e500ff" }}>Lap</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-mono text-[#8a8a9a] mb-4">Tailles d'usage</p>
            <div className="flex items-end gap-8 flex-wrap bg-[#080214] border border-[#e500ff]/10 p-8">
              {[["24px", "text-2xl"], ["40px", "text-4xl"], ["64px", "text-6xl"], ["96px", "text-8xl"]].map(([size, cls]) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <span className={`font-[family-name:var(--font-audiowide)] ${cls} -skew-x-6 inline-block leading-none`}>
                    p<span style={{ color: "#e500ff" }}>L</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#8a8a9a]">{size}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="mb-8">
            <p className="text-xs font-mono tracking-widest text-[#e500ff] uppercase mb-4">Éléments du logo mark</p>
            <ul className="space-y-3">
              {[
                ["Texte skewé −6°", "Évoque la vitesse, l'inclinaison dans les virages"],
                ['"Lap" en violet', 'Le tour violet — meilleur temps absolu en qualifications'],
                ["Coins mecha", "Codes visuels broadcast / HUD télémétrie"],
                ["Couleur unique", "#e500ff — violet purpleLap, jamais substitué"],
              ].map(([label, desc]) => (
                <li key={label} className="flex gap-3 text-sm">
                  <span className="text-[#e500ff] font-mono shrink-0">—</span>
                  <span><span className="text-white">{label}</span> <span className="text-[#8a8a9a]">: {desc}</span></span>
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <p className="text-xs font-mono text-[#8a8a9a] mb-3">Grille technique (fond de page)</p>
            <div className="h-20 border border-[#e500ff]/10" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(229,0,255,0.06) 19px, rgba(229,0,255,0.06) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(229,0,255,0.06) 19px, rgba(229,0,255,0.06) 20px)" }} />
          </div>
        </section>

        {/* ── 03 TYPOGRAPHIE ── */}
        <section id="typo" className="mb-20 scroll-mt-8">
          <SectionTitle number="03" title="Typographie" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {[
              { name: "Audiowide", role: "Titres / UI technique", cls: "font-[family-name:var(--font-audiowide)]", sample: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789" },
              { name: "Orbitron", role: "Sous-titres sections", cls: "font-[family-name:var(--font-orbitron)]", sample: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789" },
              { name: "Inter", role: "Corps / descriptions", cls: "font-sans", sample: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789" },
              { name: "VT323", role: "Écrans HUD de fond", cls: vt323.className, sample: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789" },
            ].map(({ name, role, cls, sample }) => (
              <Card key={name}>
                <p className="text-[#e500ff] text-xs font-mono tracking-widest mb-1">{name}</p>
                <p className="text-[#8a8a9a] text-xs mb-4">{role}</p>
                <p className={`${cls} text-white text-sm leading-relaxed whitespace-pre-line`}>{sample}</p>
              </Card>
            ))}
          </div>

          <div>
            <p className="text-xs font-mono tracking-widest text-[#8a8a9a] uppercase mb-5">Échelle typographique</p>
            <div className="space-y-5 border border-[#e500ff]/10 p-6 bg-[#080214]">
              <div>
                <span className="text-[10px] font-mono text-[#8a8a9a] block mb-1">H1 — Hero · Audiowide 36–48px · skewX(−6°)</span>
                <span className="font-[family-name:var(--font-audiowide)] text-4xl -skew-x-6 inline-block">purple<span style={{ color: "#e500ff" }}>Lap</span></span>
              </div>
              <div className="border-t border-[#e500ff]/8 pt-5">
                <span className="text-[10px] font-mono text-[#8a8a9a] block mb-1">H2 — Section · Orbitron 24–28px</span>
                <span className="font-[family-name:var(--font-orbitron)] text-2xl text-white tracking-wide">Selected Work</span>
              </div>
              <div className="border-t border-[#e500ff]/8 pt-5">
                <span className="text-[10px] font-mono text-[#8a8a9a] block mb-1">H3 — Card · Orbitron 16–18px</span>
                <span className="font-[family-name:var(--font-orbitron)] text-base text-white tracking-wide">Sound Design</span>
              </div>
              <div className="border-t border-[#e500ff]/8 pt-5">
                <span className="text-[10px] font-mono text-[#8a8a9a] block mb-1">Corps · Inter 16–18px · line-height 1.7</span>
                <span className="font-sans text-base text-[#bb99cc] leading-relaxed">From raw onboard footage to cinematic race edits, we craft visual content that captures the speed, precision and emotion of racing.</span>
              </div>
              <div className="border-t border-[#e500ff]/8 pt-5">
                <span className="text-[10px] font-mono text-[#8a8a9a] block mb-1">Label technique · Orbitron 10–12px · tracking widest</span>
                <span className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.3em] uppercase text-[#e500ff]">Motorsport Media Management</span>
              </div>
              <div className="border-t border-[#e500ff]/8 pt-5">
                <span className="text-[10px] font-mono text-[#8a8a9a] block mb-1">HUD data · VT323 14–18px</span>
                <span className={`${vt323.className} text-lg text-[#6bc9ff] tracking-wider`} style={{ textShadow: "0 0 8px #00a5ff88" }}>SECTOR::S1 LAP::1:31.998 THROTTLE::94%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 COMPOSANTS ── */}
        <section id="composants" className="mb-20 scroll-mt-8">
          <SectionTitle number="04" title="Composants UI" />

          {/* Boutons */}
          <div className="mb-10">
            <p className="text-xs font-mono tracking-widest text-[#8a8a9a] uppercase mb-5">Boutons</p>
            <div className="flex flex-wrap gap-4 items-center p-6 bg-[#080214] border border-[#e500ff]/10 mb-3">
              <button className="px-5 py-2 bg-[#e500ff] text-white text-xs font-[family-name:var(--font-orbitron)] tracking-widest uppercase">Bouton principal</button>
              <button className="px-5 py-2 border border-[#e500ff] text-[#e500ff] text-xs font-[family-name:var(--font-orbitron)] tracking-widest uppercase bg-transparent">Bouton secondaire</button>
              <button className="px-5 py-2 border border-[#8a8a9a]/30 text-[#8a8a9a]/40 text-xs font-[family-name:var(--font-orbitron)] tracking-widest uppercase cursor-not-allowed" disabled>Désactivé</button>
              <button className="px-5 py-2 border border-[#44ff88]/50 text-[#44ff88] text-xs font-[family-name:var(--font-orbitron)] tracking-widest uppercase" style={{ boxShadow: "0 0 8px rgba(68,255,136,0.15)" }}>All Systems Go</button>
            </div>
            <div className="flex gap-6 p-4 bg-[#080214] border border-[#e500ff]/10">
              <a className="text-[#ff44ff] text-sm font-mono cursor-pointer" style={{ textShadow: "0 0 6px #e500ff66" }}>Lien principal</a>
              <a className="text-[#bb99cc] text-sm font-mono cursor-pointer">Lien discret</a>
            </div>
          </div>

          {/* Labels & Badges */}
          <div className="mb-10">
            <p className="text-xs font-mono tracking-widest text-[#8a8a9a] uppercase mb-5">Labels & Badges</p>
            <div className="flex flex-wrap gap-4 items-center p-6 bg-[#080214] border border-[#e500ff]/10">
              <span className="px-2.5 py-1 bg-[#e500ff] text-[#0c0418] text-[10px] font-mono tracking-widest uppercase font-bold">PURPLE LAP</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 border border-[#44ff88]/40 text-[#44ff88] text-[10px] font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#44ff88] animate-pulse" />LIVE
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 border border-[#44ff88]/40 text-[#44ff88] text-[10px] font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#44ff88] animate-pulse" />ONLINE
              </span>
              <span className="w-6 h-6 rounded-full border border-[#e500ff]/40 flex items-center justify-center font-mono text-[10px] text-[#e500ff]">3</span>
              <span className="px-2 py-0.5 border border-[#e500ff]/30 text-[#e500ff] text-[10px] font-mono tracking-widest uppercase">v1.0</span>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-10">
            <p className="text-xs font-mono tracking-widest text-[#8a8a9a] uppercase mb-5">Cards</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card>
                <p className="text-xs font-mono text-[#e500ff] uppercase tracking-widest mb-2">Card standard</p>
                <p className="text-[#bb99cc] text-sm">Fond bg-card, bordure border-brand, coins mecha en L aux 4 coins.</p>
              </Card>
              <div className="bg-[#1a0a2e] border border-[#e500ff]/15 border-l-2 border-l-[#e500ff] p-5 relative">
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-r border-t border-[#e500ff]/40" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-r border-b border-[#e500ff]/40" />
                <p className="text-xs font-mono text-[#e500ff] uppercase tracking-widest mb-2">Card accent latéral</p>
                <p className="text-[#bb99cc] text-sm">Bordure gauche colorée en #e500ff, pour hiérarchie visuelle forte.</p>
              </div>
            </div>
          </div>

          {/* HUD Elements */}
          <div>
            <p className="text-xs font-mono tracking-widest text-[#8a8a9a] uppercase mb-5">Éléments HUD</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Écran HUD flottant */}
              <div>
                <p className="text-[10px] font-mono text-[#8a8a9a] mb-2">Écran HUD flottant</p>
                <div className="border border-[#00a5ff]/40 bg-[#00a5ff]/[0.03] p-3 relative" style={{ boxShadow: "0 0 15px rgba(0,165,255,0.05) inset" }}>
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-[#00a5ff]/70" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-[#00a5ff]/70" />
                  <p className="font-mono text-[9px] tracking-widest text-[#00a5ff] mb-1">◣ TELEMETRY</p>
                  <p className={`${vt323.className} text-2xl text-[#6bc9ff]`} style={{ textShadow: "0 0 6px #00a5ff88" }}>SPEED 298 KPH</p>
                  <p className={`${vt323.className} text-xl text-[#6bc9ff]`}>THROTTLE 94%</p>
                </div>
              </div>

              {/* Coin mecha */}
              <div>
                <p className="text-[10px] font-mono text-[#8a8a9a] mb-2">Coin de repère mecha (L)</p>
                <div className="relative h-20 border border-dashed border-[#e500ff]/10 flex items-center justify-center">
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#e500ff]" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#e500ff]" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#e500ff]" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#e500ff]" />
                  <span className="text-[#8a8a9a] text-xs font-mono">contenu cadré</span>
                </div>
              </div>

              {/* Scanline CRT */}
              <div>
                <p className="text-[10px] font-mono text-[#8a8a9a] mb-2">Overlay scanlines CRT</p>
                <div className="h-16 bg-[#1a0a2e] relative overflow-hidden border border-[#e500ff]/10">
                  <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(229,0,255,0.07) 2px, rgba(229,0,255,0.07) 3px)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-xs text-[#bb99cc]">Texte sous scanlines</span>
                  </div>
                </div>
              </div>

              {/* Speed trace */}
              <div>
                <p className="text-[10px] font-mono text-[#8a8a9a] mb-2">Speed trace</p>
                <div className="h-16 bg-[#080214] border border-[#e500ff]/10 relative flex items-end px-2 pb-1 gap-[2px]">
                  {[60,72,85,90,95,88,70,55,62,78,92,98,85,73,65,80,94,99,88,72].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `rgba(229,0,255,${0.3 + h/200})` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 TON ── */}
        <section id="ton" className="mb-20 scroll-mt-8">
          <SectionTitle number="05" title="Ton & Vocabulaire" />

          <Card className="mb-8 border-l-2 border-l-[#e500ff]">
            <p className="text-xs font-mono text-[#e500ff] uppercase tracking-widest mb-2">Règle d'or</p>
            <p className="text-white text-base leading-relaxed italic">"Si un team manager ou un pilote ne comprend pas en 10 secondes, c'est mal dit."</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-mono tracking-widest text-[#44ff88] uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#44ff88]" />À utiliser
              </p>
              <div className="border border-[#44ff88]/20 bg-[#44ff88]/[0.02] divide-y divide-[#44ff88]/10">
                {[
                  ["Métier", "Course, équipe, paddock, garage, briefing"],
                  ["Problèmes", "Contenu qui colle pas, vidéos en retard, pas de visibilité"],
                  ["Solutions", "On s'en occupe, clé en main, prêt à poster"],
                  ["Argent", "Budget, retour sur investissement, ce que ça rapporte en visibilité"],
                  ["Action", "On en discute, on vous montre, premier contact"],
                ].map(([cat, words]) => (
                  <div key={cat} className="px-4 py-3 flex gap-3">
                    <span className="font-mono text-[11px] text-[#44ff88] w-24 shrink-0">{cat}</span>
                    <span className="text-[#bb99cc] text-sm">{words}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono tracking-widest text-[#e500ff] uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e500ff]" />À bannir
              </p>
              <div className="border border-[#e500ff]/20 bg-[#e500ff]/[0.02] divide-y divide-[#e500ff]/10">
                {[
                  ["Jargon tech", "Workflow, pipeline, deliverables, assets, KPI"],
                  ["Jargon startup", "Disruptif, game-changer, scaler, booster"],
                  ["Jargon corpo", "Optimiser, transformation digitale, synergie, expertise"],
                  ["Mots vides", "Innovant, unique, révolutionnaire, premium"],
                ].map(([cat, words]) => (
                  <div key={cat} className="px-4 py-3 flex gap-3">
                    <span className="font-mono text-[11px] text-[#e500ff] w-24 shrink-0">{cat}</span>
                    <span className="text-[#bb99cc] text-sm">{words}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest text-[#8a8a9a] uppercase mb-5">Exemples de reformulation</p>
            <div className="space-y-3">
              {[
                ["Optimiser votre contenu digital", "Vos vidéos, prêtes à poster"],
                ["Dashboard de pilotage", "Tout sur un écran"],
                ["Workflow automatisé", "Ça tourne tout seul"],
                ["Stratégie de contenu personnalisée", "Du contenu qui vous ressemble"],
                ["Onboarding client", "On vous montre comment ça marche"],
                ["Deliverables haute qualité", "Des vidéos qui claquent"],
              ].map(([bad, good]) => (
                <div key={bad} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-[#080214] border border-[#e500ff]/8">
                  <span className="text-sm text-[#8a8a9a] line-through flex-1">✗ {bad}</span>
                  <span className="text-[#e500ff]/40 hidden sm:block">→</span>
                  <span className="text-sm text-white flex-1">✓ {good}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <p className="text-[10px] font-mono text-[#8a8a9a] uppercase tracking-widest mb-2">CTA principal</p>
              <p className="font-[family-name:var(--font-orbitron)] text-white text-lg">"On en parle ?"</p>
            </Card>
            <Card>
              <p className="text-[10px] font-mono text-[#8a8a9a] uppercase tracking-widest mb-2">CTA secondaire</p>
              <p className="font-[family-name:var(--font-orbitron)] text-white text-lg">"Voir ce qu'on fait"</p>
            </Card>
            <Card>
              <p className="text-[10px] font-mono text-[#8a8a9a] uppercase tracking-widest mb-2">Contact</p>
              <p className="font-mono text-[#e500ff] text-sm">purplelapmedia@proton.me</p>
            </Card>
          </div>
        </section>

        {/* ── 06 CHECKLIST ── */}
        <section id="checklist" className="mb-20 scroll-mt-8">
          <SectionTitle number="06" title="Checklist avant publication" />

          <div className="border border-[#e500ff]/15 divide-y divide-[#e500ff]/8">
            {checklistItems.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#e500ff]/[0.03] transition-colors duration-150"
              >
                <span className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors duration-150 ${checked.has(i) ? "border-[#44ff88] bg-[#44ff88]/10" : "border-[#e500ff]/30"}`}>
                  {checked.has(i) && <span className="text-[#44ff88] text-[10px] leading-none">✓</span>}
                </span>
                <span className={`text-sm transition-colors duration-150 ${checked.has(i) ? "text-[#8a8a9a] line-through" : "text-[#bb99cc]"}`}>{item}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between px-5 py-3 bg-[#080214] border border-[#e500ff]/10">
            <span className="font-mono text-xs text-[#8a8a9a]">Progression</span>
            <span className="font-mono text-xs text-[#e500ff]">{checked.size} / {checklistItems.length}</span>
          </div>

          {checked.size === checklistItems.length && (
            <div className="mt-4 p-4 border border-[#44ff88]/30 bg-[#44ff88]/[0.04] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#44ff88] animate-pulse" />
              <span className="font-mono text-sm text-[#44ff88] tracking-widest uppercase">All systems go — prêt à publier</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
