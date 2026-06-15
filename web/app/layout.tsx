import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tickpruv: trustless skill wagering on Solana",
  description:
    "A verifiable game engine for Solana. Game logic compiles to SBF, runs off-chain at full speed, and any disputed tick is replayed natively by the chain itself.",
  openGraph: {
    type: "website",
    title: "tickpruv: trustless skill wagering on Solana",
    description:
      "Game logic compiles to SBF, runs off-chain at full speed. Any disputed tick is replayed natively by the chain. No oracle, no zkVM, no trusted reporter.",
    url: "https://tickpruv.vercel.app",
    images: [{ url: "https://tickpruv.vercel.app/og.png", width: 1200, height: 630 }],
    siteName: "tickpruv",
  },
  twitter: {
    card: "summary_large_image",
    title: "tickpruv: trustless skill wagering on Solana",
    description:
      "Game logic compiles to SBF, runs off-chain at full speed. Any disputed tick is replayed natively by the chain. No oracle, no zkVM, no trusted reporter.",
    images: ["https://tickpruv.vercel.app/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
