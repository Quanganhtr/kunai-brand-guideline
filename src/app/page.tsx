"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import LogoSection from "./components/LogoSection";
import FontDownloadButton from "./components/FontDownloadButton";
import Sidebar from "./components/Sidebar";
import IconSection from "./components/IconSection";
import ComponentSection from "./components/ComponentSection";

const SECTION_IDS = ["logo", "colors", "typography", "voice", "components"];

const colors = [
  { name: "Kunai Green", hex: "#00FA64", note: "Primary brand color" },
  { name: "Kunai Blue", hex: "#018DFE", note: "Secondary brand color" },
  { name: "Black", hex: "#000000", note: "Primary background" },
  { name: "White", hex: "#FFFFFF", note: "On-dark text" },
];

const typeScale = [
  { label: "Display",    size: "text-6xl",  weight: "font-bold",     sample: "Bold Ideas" },
  { label: "Heading",    size: "text-4xl",  weight: "font-semibold", sample: "Clear Direction" },
  { label: "Subheading", size: "text-2xl",  weight: "font-medium",   sample: "Purposeful Design" },
  { label: "Body",       size: "text-base", weight: "font-normal",   sample: "Every detail matters in building a coherent brand identity." },
  { label: "Caption",    size: "text-sm",   weight: "font-normal",   sample: "Supporting information and metadata" },
];

export default function Home() {
  const scrollRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("logo");

  const updateActive = useCallback(() => {
    const container = scrollRef.current;
    const containerTop = container ? container.getBoundingClientRect().top : 0;
    let current = SECTION_IDS[0];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top - containerTop <= 96) {
        current = id;
      }
    });
    setActive(current);
  }, []);

  // Mobile: window scrolls (no overflow-y-auto on main)
  useEffect(() => {
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  return (
    <div className="bg-[#0A0A0A] text-white flex flex-col lg:flex-row lg:h-screen font-sans">

      <Sidebar scrollRef={scrollRef} active={active} />

      {/* RIGHT — scrollable content, onScroll handles desktop */}
      <main
        ref={scrollRef}
        className="flex-1 lg:h-screen lg:overflow-y-auto"
        onScroll={updateActive}
      >

        <LogoSection />

        {/* Colors */}
        <section id="colors" className="px-4 py-6 lg:px-12 lg:py-16 border-b border-white/10">
          <SectionLabel>02 — Color</SectionLabel>
          <h2 className="text-3xl font-semibold mb-10">Color Palette</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div key={c.hex} className="flex flex-col gap-3">
                <div
                  className="h-32 rounded-xl border border-white/10"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-white/40 text-xs font-mono">{c.hex}</p>
                  <p className="text-white/40 text-xs mt-1">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section id="typography" className="px-4 py-6 lg:px-12 lg:py-16 border-b border-white/10">
          <SectionLabel>03 — Typography</SectionLabel>
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-3xl font-semibold">Type Scale</h2>
            <FontDownloadButton />
          </div>
          <p className="text-white/50 mb-10 text-sm">Kunai Pro — a geometric sans-serif with warmth and precision.</p>
          <div className="flex flex-col divide-y divide-white/10">
            {typeScale.map((t) => (
              <div key={t.label} className="py-6 flex items-baseline gap-8">
                <span className="text-white/30 text-xs font-mono w-20 shrink-0">{t.label}</span>
                <p className={`${t.size} ${t.weight} leading-tight`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </section>

        <IconSection />

        <ComponentSection />

      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono tracking-widest text-white/30 uppercase mb-3">{children}</p>
  );
}
