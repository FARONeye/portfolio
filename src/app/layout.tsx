// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "./teleport-fx.css";

export const metadata: Metadata = {
  title: "Mathis Truong — Portfolio",
  description: "Développeur créatif : art, code et mouvement.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
