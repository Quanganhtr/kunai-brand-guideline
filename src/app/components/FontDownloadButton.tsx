"use client";

const kunaiProFiles = [
  "KunaiPro-Thin",
  "KunaiPro-ThinItalic",
  "KunaiPro-Light",
  "KunaiPro-LightItalic",
  "KunaiPro-Regular",
  "KunaiPro-RegularItalic",
  "KunaiPro-Medium",
  "KunaiPro-MediumItalic",
  "KunaiPro-Bold",
  "KunaiPro-BoldItalic",
  "KunaiPro-Black",
  "KunaiPro-BlackItalic",
];

export default function FontDownloadButton() {
  function downloadAll() {
    kunaiProFiles.forEach((name, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = `/fonts/Kunai Pro/${name}.otf`;
        a.download = `${name}.otf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 150);
    });
  }

  return (
    <button
      onClick={downloadAll}
      className="flex items-center gap-2 px-4 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Download Kunai Pro ({kunaiProFiles.length} files)
    </button>
  );
}
