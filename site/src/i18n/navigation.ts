// src/i18n/navigation.ts
import {createSharedPathnamesNavigation} from "next-intl/navigation";

export const locales = ["en", "fr"] as const;
export type AppLocale = (typeof locales)[number];

export const {Link, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales});
