import type { Metadata } from "next";
import "./globals.css";
import HtmlFix from "./HtmlFix";

export const metadata: Metadata = {
  title: "Portfolio | Mathis",
  description: "Mon portfolio animé en Next.js + Tailwind + Framer Motion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <HtmlFix />
        {children}
      </body>
    </html>
  );
}
