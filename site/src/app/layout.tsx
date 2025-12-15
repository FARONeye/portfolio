// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "./teleport-fx.css";


export const metadata: Metadata = {
  title: "Mathis Truong — Portfolio",
  description: "Développeur créatif : art, code et mouvement.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },      // si tu ajoutes app/icon.png
      { url: "/favicon.ico", type: "image/x-icon" } // fallback
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 👇 1) force a fixed class and 2) suppressHydrationWarning to ignore extension-induced diffs
    <html lang="fr" className="theme-dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
