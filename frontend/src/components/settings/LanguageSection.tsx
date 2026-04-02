import { useI18nStore, useTranslation } from "../../i18n/i18nStore";

export const LanguageSection = (): JSX.Element => {
  const t = useTranslation();
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  const isPortuguese = locale === "pt-br";

  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-txt-tertiary">
        {t.settings.language}
      </span>
      <div className="flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={isPortuguese ? "text-txt-muted" : "text-txt"}>EN</span>
          <span className="text-txt-muted">/</span>
          <span className={isPortuguese ? "text-txt" : "text-txt-muted"}>PT</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isPortuguese}
          aria-label={t.settings.language}
          onClick={() => setLocale(isPortuguese ? "en" : "pt-br")}
          className="relative inline-flex h-6 w-14 shrink-0 cursor-pointer items-center rounded-full bg-brand transition-colors"
        >
          <span
            className={`absolute left-1 text-[0.6rem] font-bold transition-opacity ${isPortuguese ? "opacity-0" : "text-white opacity-100"}`}
          >
            EN
          </span>
          <span
            className={`absolute right-1.5 text-[0.6rem] font-bold transition-opacity ${isPortuguese ? "text-white opacity-100" : "opacity-0"}`}
          >
            PT
          </span>
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              isPortuguese ? "translate-x-[34px]" : "translate-x-[2px]"
            }`}
          />
        </button>
      </div>
    </div>
  );
};
