export const locales = ["en", "vi", "zh", "ja", "ko", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  vi: "VI",
  zh: "\u4E2D\u6587",
  ja: "\u65E5\u672C\u8A9E",
  ko: "\uD55C\uAD6D\uC5B4",
  ru: "RU",
};

export const localeFlags: Record<Locale, string> = {
  en: "\uD83C\uDDFA\uD83C\uDDF8",
  vi: "\uD83C\uDDFB\uD83C\uDDF3",
  zh: "\uD83C\uDDE8\uD83C\uDDF3",
  ja: "\uD83C\uDDEF\uD83C\uDDF5",
  ko: "\uD83C\uDDF0\uD83C\uDDF7",
  ru: "\uD83C\uDDF7\uD83C\uDDFA",
};
