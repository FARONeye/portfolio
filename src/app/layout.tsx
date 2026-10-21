import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mathis Truong — Développeur Full-Stack Node.js & Google Cloud",
  description: "Mathis Truong, développeur full-stack Node.js & Google Cloud chez Air Liquide. Applications internes sécurisées, du front-end au déploiement cloud.",
};

// Phone browsers tint their toolbars with the page surface instead of a white band.
export const viewport: Viewport = {
  themeColor: "#0c0d12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Script src="/motion.js?v=57" strategy="afterInteractive" />
      </body>
    </html>
  );
}
