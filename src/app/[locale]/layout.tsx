// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import LangAttributeSync from "@/components/LangAttributeSync";
import { TeleportProvider } from "@/components/TeleportProvider";


const locales = ["en", "fr"] as const;
type AppLocale = (typeof locales)[number];

function isAppLocale(v: string): v is AppLocale {
  return (locales as readonly string[]).includes(v);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) notFound();

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Optionnel mais utile : met à jour <html lang=".."> côté client */}
      <LangAttributeSync locale={locale} />

      {/* ✅ FX global (survit aux changements de page) */}
      <TeleportProvider>{children}</TeleportProvider>
    </NextIntlClientProvider>
  );
}
