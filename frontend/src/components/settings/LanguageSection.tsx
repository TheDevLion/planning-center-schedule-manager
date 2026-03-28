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
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-slate-500">
        {t.settings.language}
      </span>
      <div className="flex items-center gap-0.5 self-start rounded-full border border-slate-200 bg-slate-50 p-0.5">
        {LOCALES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setLocale(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              locale === key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
