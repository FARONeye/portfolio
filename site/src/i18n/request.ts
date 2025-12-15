// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "fr"] as const;
type AppLocale = (typeof locales)[number];

function isAppLocale(v: string): v is AppLocale {
  return (locales as readonly string[]).includes(v);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const maybeLocale = await requestLocale;
  const locale: AppLocale =
    maybeLocale && isAppLocale(maybeLocale) ? maybeLocale : "en";

  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
