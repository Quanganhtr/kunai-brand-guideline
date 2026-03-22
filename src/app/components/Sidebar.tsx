"use client";

import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef, useEffect } from "react";
import backgroundAnimation from "../../../public/background.json";

const brandGreen = "#00FA64";

function BgLottie() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  useEffect(() => { lottieRef.current?.setSpeed(0.25); }, []);
  return <Lottie lottieRef={lottieRef} animationData={backgroundAnimation} loop autoplay className="w-full h-auto" />;
}

const navLinks = [
  { href: "logo",       label: "Logo",       number: "01" },
  { href: "colors",     label: "Color",      number: "02" },
  { href: "typography", label: "Typography", number: "03" },
  { href: "voice",      label: "Icons",      number: "04" },
  { href: "components", label: "Components", number: "05" },
];

export default function Sidebar({
  scrollRef,
  active,
}: {
  scrollRef: React.RefObject<HTMLElement | null>;
  active: string;
}) {
  function scrollTo(id: string) {
    const container = scrollRef.current;
    const el = (container ?? document).querySelector(`#${id}`);
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ── MOBILE / TABLET: sticky top nav ── */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-6 h-14">
          <Image src="/logo-symbol.svg" alt="Kunai" width={16} height={20} priority />
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/40"}`}
                  style={isActive ? { color: brandGreen } : undefined}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── DESKTOP: vertical sidebar ── */}
      <aside className="hidden lg:flex relative w-1/2 shrink-0 h-screen overflow-hidden border-r border-white/10 flex-col p-8">
        {/* Lottie background */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full z-10">
            <div style={{ height: 156, background: '#0A0A0A' }} />
            <div style={{ height: 156, background: 'linear-gradient(to bottom, #0A0A0A, transparent)' }} />
          </div>
          <BgLottie />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex flex-col gap-10">
            <Image src="/logo-symbol.svg" alt="Kunai symbol" width={20} height={24} priority />

            <div className="flex flex-col gap-3">
              <h1 className="text-[64px] font-bold leading-none">Brand Guidelines</h1>
              <p className="text-white/50 text-xs leading-relaxed">
                A unified visual language for Kunai — defining how we look, speak,
                and show up across every touchpoint.
              </p>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = active === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className={`flex items-center gap-3 py-2 transition-colors text-left group ${
                      isActive ? "text-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    <span
                      className="font-mono transition-all"
                      style={{ fontSize: isActive ? 32 : undefined, color: isActive ? brandGreen : undefined }}
                    >
                      {isActive
                        ? link.number
                        : <span className="text-xs w-5 text-white/20 group-hover:text-white/40">{link.number}</span>}
                    </span>
                    <span className={`transition-all ${isActive ? "text-[32px] font-bold" : "text-sm font-medium"}`}>
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Kunai.<br />Internal use only.
          </p>
        </div>
      </aside>
    </>
  );
}
