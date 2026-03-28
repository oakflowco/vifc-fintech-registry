import type { Locale } from "./locales";
import { defaultLocale } from "./locales";

import en from "./dictionaries/en.json";
import vi from "./dictionaries/vi.json";
import zh from "./dictionaries/zh.json";
import ja from "./dictionaries/ja.json";
import ko from "./dictionaries/ko.json";
import ru from "./dictionaries/ru.json";

// Other locales may have missing keys — fall back to English at runtime
const dictionaries: Record<Locale, Record<string, unknown>> = { en, vi, zh, ja, ko, ru };

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  // Deep merge: use English as base, overlay with requested locale
  const base = dictionaries[defaultLocale] as Dictionary;
  if (locale === defaultLocale) return base;
  const overlay = dictionaries[locale] as Partial<Dictionary>;
  return deepMerge(base, overlay);
}

function deepMerge<T extends Record<string, unknown>>(base: T, overlay: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(overlay) as (keyof T)[]) {
    const val = overlay[key];
    if (val && typeof val === "object" && !Array.isArray(val) && typeof result[key] === "object") {
      result[key] = deepMerge(result[key] as Record<string, unknown>, val as Record<string, unknown>) as T[keyof T];
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}
