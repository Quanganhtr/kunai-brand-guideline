"use client";

import Image from "next/image";
import { useState } from "react";

const CANVAS = 1080;
const ICON_SIZE = 600;
const OFFSET = (CANVAS - ICON_SIZE) / 2; // 240

const icons = [
  { src: "/icon/arrow-right.svg", name: "Arrow Right" },
  { src: "/icon/close.svg",       name: "Close" },
  { src: "/icon/file.svg",        name: "File" },
  { src: "/icon/home.svg",        name: "Home" },
  { src: "/icon/love.svg",        name: "Love" },
  { src: "/icon/menu.svg",        name: "Menu" },
  { src: "/icon/question.svg",    name: "Question" },
  { src: "/icon/trade.svg",       name: "Trade" },
];

const bgHex = "#0A0A0A";

function buildExportSvg(svgText: string): string {
  // Extract original viewBox to use as nested SVG dimensions
  const vbMatch = svgText.match(/viewBox="([^"]+)"/);
  const vb = vbMatch ? vbMatch[1] : `0 0 ${ICON_SIZE} ${ICON_SIZE}`;
  const innerMatch = svgText.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const inner = innerMatch ? innerMatch[1].trim() : "";

  return `<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS}" height="${CANVAS}" fill="${bgHex}"/>
  <svg x="${OFFSET}" y="${OFFSET}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${vb}">
    ${inner}
  </svg>
</svg>`;
}

function downloadFile(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function IconCard({ src, name }: { src: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const filename = src.split("/").pop()!.replace(".svg", "");

  async function getSvgText() {
    const res = await fetch(src);
    return res.text();
  }

  async function handleCopy() {
    const svg = buildExportSvg(await getSvgText());
    await navigator.clipboard.writeText(svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDownloadSvg() {
    const svg = buildExportSvg(await getSvgText());
    const blob = new Blob([svg], { type: "image/svg+xml" });
    downloadFile(URL.createObjectURL(blob), `${filename}.svg`);
  }

  async function handleExportPng() {
    setExporting(true);
    const svgText = buildExportSvg(await getSvgText());
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.src = url;
    await new Promise((r) => (img.onload = r));
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS;
    canvas.height = CANVAS;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, CANVAS, CANVAS);
    ctx.drawImage(img, 0, 0, CANVAS, CANVAS);
    URL.revokeObjectURL(url);
    downloadFile(canvas.toDataURL("image/png"), `${filename}.png`);
    setExporting(false);
  }

  return (
    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10">
      {/* Icon display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image src={src} alt={name} width={ICON_SIZE} height={ICON_SIZE} className="w-[56%] h-auto" />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
        <span className="text-xs text-white/50 mb-1">{name}</span>
        <button
          onClick={handleCopy}
          className="w-full max-w-[160px] h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
        >
          {copied ? "Copied!" : "Copy SVG"}
        </button>
        <button
          onClick={handleDownloadSvg}
          className="w-full max-w-[160px] h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
        >
          Export SVG
        </button>
        <button
          onClick={handleExportPng}
          disabled={exporting}
          className="w-full max-w-[160px] h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors disabled:opacity-50"
        >
          {exporting ? "Exporting…" : "Export PNG"}
        </button>
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-xs text-white/30 group-hover:opacity-0 transition-opacity">{name}</span>
      </div>
    </div>
  );
}

export default function IconSection() {
  // Distribute icons across 3 masonry columns
  const cols: (typeof icons)[] = [[], [], []];
  icons.forEach((icon, i) => cols[i % 3].push(icon));

  return (
    <section id="voice" className="px-12 py-16 border-b border-white/10">
      <p className="text-xs font-mono tracking-widest text-white/30 uppercase mb-3">04 — Icons</p>
      <h2 className="text-3xl font-semibold mb-10">Icon Set</h2>

      <div className="flex gap-3 items-start">
        {cols.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-3">
            {col.map((icon) => (
              <IconCard key={icon.src} {...icon} />
            ))}
            {/* Coming soon card in last column */}
            {ci === cols.length - 1 && (
              <div className="aspect-square rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-2">
                <span className="text-white/20 text-xs font-mono tracking-widest uppercase">Coming soon</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
