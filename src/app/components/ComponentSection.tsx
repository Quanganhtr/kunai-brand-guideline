"use client";

import { useRef, useState, useCallback } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import arrowAnimation from "../../../public/arrow-right.json";

const brandGreen = "#00FA64";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

const WRANGLER_INTERVAL = 23;   // ms per frame
const WRANGLER_MULTIPLIER = 4;  // frames per character
const LOTTIE_DURATION_MS = (90 / 60) * 1000; // 90 frames @ 60fps = 1500ms

function useScramble(original: string) {
  const [text, setText] = useState(original);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scramble = useCallback(() => {
    let iteration = 0;
    const totalFrames = original.length * WRANGLER_MULTIPLIER;

    clearInterval(frameRef.current!);
    frameRef.current = setInterval(() => {
      setText(
        original
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < Math.floor(iteration / 4)) return original[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iteration++;
      if (iteration > totalFrames) clearInterval(frameRef.current!);
    }, WRANGLER_INTERVAL);
  }, [original]);

  const reset = useCallback(() => {
    clearInterval(frameRef.current!);
    setText(original);
  }, [original]);

  return { text, scramble, reset };
}

function LetsGoButton() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const { text, scramble, reset } = useScramble("Let's go");

  function handleEnter() {
    const wranglerDuration = "Let's go".length * WRANGLER_MULTIPLIER * WRANGLER_INTERVAL;
    lottieRef.current?.setSpeed(LOTTIE_DURATION_MS / wranglerDuration);
    lottieRef.current?.play();
    scramble();
  }

  function handleLeave() {
    lottieRef.current?.goToAndStop(0, true);
    reset();
  }

  return (
    <button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex items-center gap-4 px-6 h-14 border bg-[#0A0A0A] font-semibold text-sm font-mono transition-transform duration-150 active:scale-[0.9] lg:active:scale-[1.8] lg:scale-[2]"
      style={{ color: brandGreen, borderRadius: 999, borderColor: "#333" }}
    >
      {text}
      <Lottie
        lottieRef={lottieRef}
        animationData={arrowAnimation}
        autoplay={false}
        loop={false}
        onComplete={() => lottieRef.current?.goToAndStop(0, true)}
        style={{ width: 24, height: 24 }}
      />
    </button>
  );
}

export default function ComponentSection() {
  return (
    <section id="components" className="px-4 py-6 lg:px-12 lg:py-16 border-b border-white/10 min-h-screen">
      <p className="text-xs font-mono tracking-widest text-white/30 uppercase mb-3">05 — Components</p>
      <h2 className="text-3xl font-semibold mb-10">Components</h2>

      {/* 1:1 preview area */}
      <div
        className="aspect-square w-full rounded-2xl border border-white/10 flex items-center justify-center"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <LetsGoButton />
      </div>
    </section>
  );
}
