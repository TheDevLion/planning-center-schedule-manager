import { useI18nStore, useTranslation } from "../../i18n/i18nStore";
import type { Locale } from "../../i18n/i18nStore";

const LOCALES: { key: Locale; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "pt-br", label: "PT" },
];

export const LanguageSection = (): JSX.Element => {
  const t = useTranslation();
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-txt-tertiary">
        {t.settings.language}
      </span>
      <div className="flex items-center gap-0.5 self-start rounded-full border border-border bg-card-alt p-0.5">
        {LOCALES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setLocale(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              locale === key
                ? "bg-card text-txt shadow-sm"
                : "text-txt-tertiary hover:text-txt-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
