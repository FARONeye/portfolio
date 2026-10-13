import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mathis Truong — Portfolio",
  description: "Le portfolio personnel de Mathis Truong : développement, création et curiosité.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Script src="/motion.js?v=19" strategy="afterInteractive" />
      </body>
    </html>
  );
}
