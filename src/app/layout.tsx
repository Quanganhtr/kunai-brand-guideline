import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const kunaiPro = localFont({
  src: [
    { path: "../../public/fonts/Kunai Pro/KunaiPro-Thin.otf", weight: "100", style: "normal" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-Black.otf", weight: "900", style: "normal" },
    { path: "../../public/fonts/Kunai Pro/KunaiPro-BlackItalic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-kunai-pro",
});

const kunaiMono = localFont({
  src: [
    { path: "../../public/fonts/Kunai Mono/KunaiMono-Thin.otf", weight: "100", style: "normal" },
    { path: "../../public/fonts/Kunai Mono/KunaiMono-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Kunai Mono/KunaiMono-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Kunai Mono/KunaiMono-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Kunai Mono/KunaiMono-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Kunai Mono/KunaiMono-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-kunai-mono",
});

export const metadata: Metadata = {
  title: "Kunai — Brand Guidelines",
  description: "Official brand guidelines for Kunai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kunaiPro.variable} ${kunaiMono.variable} h-screen antialiased`}
    >
      <body className="h-screen">{children}</body>
    </html>
  );
}
