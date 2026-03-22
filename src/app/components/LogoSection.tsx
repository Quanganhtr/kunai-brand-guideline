"use client";

import Image from "next/image";
import { useState } from "react";

// Export dimensions
const SYMBOL_SIZE = 1080;              // 1:1
const WORDMARK_W = 1920;
const WORDMARK_H = Math.round(1920 * 9 / 16); // 1080 — 16:9

type CardProps = {
  src: string;
  alt: string;
  bg: string;
  bgHex: string;
  label: string;
  dark?: boolean;
  className?: string;
};

function createExportSvg(svgText: string, isSymbol: boolean, bgHex: string, darkFill: boolean): string {
  const canvasW = isSymbol ? SYMBOL_SIZE : WORDMARK_W;
  const canvasH = isSymbol ? SYMBOL_SIZE : WORDMARK_H;
  const logoW   = isSymbol ? 600 : 1080;

  // Parse original viewBox to get natural dimensions
  const vbMatch = svgText.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const origW = vbMatch ? parseFloat(vbMatch[1]) : (isSymbol ? 21 : 84);
  const origH = vbMatch ? parseFloat(vbMatch[2]) : 25;

  const scale  = logoW / origW;
  const logoH  = origH * scale;
  const tx     = (canvasW - logoW) / 2;
  const ty     = (canvasH - logoH) / 2;

  // Extract inner SVG content (paths, etc.)
  const innerMatch = svgText.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  let inner = innerMatch ? innerMatch[1].trim() : "";
  if (darkFill) inner = inner.replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="#0A0A0A"');

  return `<svg width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${canvasW}" height="${canvasH}" fill="${bgHex}"/>
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    ${inner}
  </g>
</svg>`;
}

function downloadFile(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

async function handleCopySVG(src: string, isSymbol: boolean, bgHex: string, darkFill: boolean) {
  const res = await fetch(src);
  const text = await res.text();
  await navigator.clipboard.writeText(createExportSvg(text, isSymbol, bgHex, darkFill));
}

async function handleDownloadSVG(src: string, filename: string, isSymbol: boolean, bgHex: string, darkFill: boolean) {
  const res = await fetch(src);
  const text = await res.text();
  const blob = new Blob([createExportSvg(text, isSymbol, bgHex, darkFill)], { type: "image/svg+xml" });
  downloadFile(URL.createObjectURL(blob), `${filename}.svg`);
}

async function handleExportPNG(src: string, filename: string, isSymbol: boolean, bgHex: string, darkFill: boolean) {
  const canvasW = isSymbol ? SYMBOL_SIZE : WORDMARK_W;
  const canvasH = isSymbol ? SYMBOL_SIZE : WORDMARK_H;
  const logoW   = isSymbol ? 600 : 1080;

  const res = await fetch(src);
  const svgText = createExportSvg(await res.text(), isSymbol, bgHex, darkFill);
  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const img = new window.Image();
  img.src = url;
  await new Promise((r) => (img.onload = r));

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, canvasW, canvasH);

  const logoH = (img.naturalHeight / img.naturalWidth) * logoW;
  const drawX = (canvasW - logoW) / 2;
  const drawY = (canvasH - logoH) / 2;
  ctx.drawImage(img, drawX, drawY, logoW, logoH);

  URL.revokeObjectURL(url);
  downloadFile(canvas.toDataURL("image/png"), `${filename}.png`);
}

function LogoCard({ src, alt, bg, bgHex, label, dark, className = "" }: CardProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const isSymbol = src === "/logo-symbol.svg";
  const aspectClass = isSymbol ? "aspect-square" : "aspect-video";
  const imgFilter = dark ? "brightness-0" : "";
  const darkFill = !!dark;
  const filename = src.replace("/", "").replace(".svg", "");

  async function handleCopy() {
    await handleCopySVG(src, isSymbol, bgHex, darkFill);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handlePNG() {
    setExporting(true);
    await handleExportPNG(src, filename, isSymbol, bgHex, darkFill);
    setExporting(false);
  }

  return (
    <div className={`group relative rounded-2xl overflow-hidden ${bg} ${aspectClass} ${className}`}>
      {/* Logo — centered at export proportion (~56% width) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={isSymbol ? 21 : 84}
          height={25}
          className={`w-[56%] h-auto ${imgFilter}`}
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
        <span className="text-xs text-white/50 mb-1">{label}</span>
        <button
          onClick={handleCopy}
          className="w-full max-w-[160px] h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
        >
          {copied ? "Copied!" : "Copy SVG"}
        </button>
        <button
          onClick={() => handleDownloadSVG(src, filename, isSymbol, bgHex, darkFill)}
          className="w-full max-w-[160px] h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
        >
          Export SVG
        </button>
        <button
          onClick={handlePNG}
          disabled={exporting}
          className="w-full max-w-[160px] h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors disabled:opacity-50"
        >
          {exporting ? "Exporting…" : "Export PNG"}
        </button>
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className={`text-xs ${dark ? "text-black/30" : "text-white/30"} group-hover:opacity-0 transition-opacity`}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function LogoSection() {
  return (
    <section id="logo" className="px-4 py-6 lg:px-12 lg:py-16 border-b border-white/10">
      <p className="text-xs font-mono tracking-widest text-white/30 uppercase mb-3">01 — Logo</p>
      <h2 className="text-3xl font-semibold mb-10">Logo Usage</h2>

      <div className="flex gap-3 items-start">

        {/* Column 1 */}
        <div className="flex-1 flex flex-col gap-3">
          <LogoCard
            src="/logo.svg" alt="Kunai wordmark"
            bg="bg-[#0A0A0A] border border-white/10" bgHex="#0A0A0A"
            label="Wordmark — On Dark"
          />
          <LogoCard
            src="/logo-symbol.svg" alt="Kunai symbol"
            bg="bg-white" bgHex="#FFFFFF"
            label="Symbol — On Light"
            dark
          />
          <LogoCard
            src="/logo.svg" alt="Kunai wordmark"
            bg="bg-[#00FA64]" bgHex="#00FA64"
            label="Wordmark — On Brand"
            dark
          />
        </div>

        {/* Column 2 */}
        <div className="flex-1 flex flex-col gap-3">
          <LogoCard
            src="/logo-symbol.svg" alt="Kunai symbol"
            bg="bg-[#0A0A0A] border border-white/10" bgHex="#0A0A0A"
            label="Symbol — On Dark"
          />
          <LogoCard
            src="/logo.svg" alt="Kunai wordmark"
            bg="bg-white" bgHex="#FFFFFF"
            label="Wordmark — On Light"
            dark
          />
          <LogoCard
            src="/logo-symbol.svg" alt="Kunai symbol"
            bg="bg-[#00FA64]" bgHex="#00FA64"
            label="Symbol — On Brand"
            dark
          />
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Clear Space</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Always maintain a minimum clear space equal to the cap-height of the wordmark on
              all sides. Never place the logo on busy backgrounds or use colors other than
              Kunai Green or White.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
