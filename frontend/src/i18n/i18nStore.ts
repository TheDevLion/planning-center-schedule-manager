import { create } from "zustand";

import { en } from "./en";
import type { Translations } from "./en";
import { ptBr } from "./pt-br";

export type Locale = "en" | "pt-br";

const translations: Record<Locale, Translations> = { en, "pt-br": ptBr };

type I18nState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useI18nStore = create<I18nState>()((set) => ({
  locale: "en",
  setLocale: (locale) => set({ locale }),
}));

export const useTranslation = (): Translations => {
  const locale = useI18nStore((s) => s.locale);
  return translations[locale];
};

export const getTranslation = (): Translations =>
  translations[useI18nStore.getState().locale];
