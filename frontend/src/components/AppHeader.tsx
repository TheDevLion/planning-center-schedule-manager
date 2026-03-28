import { Compass } from "lucide-react";

import { useI18nStore, useTranslation } from "../i18n/i18nStore";
import type { Locale } from "../i18n/i18nStore";

const LOCALES: { key: Locale; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "pt-br", label: "PT" },
];

type AppHeaderProps = {
  onStartTour: () => void;
};

export const AppHeader = ({ onStartTour }: AppHeaderProps): JSX.Element => {
  const t = useTranslation();
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  return (
    <header
      id="app-header"
      data-testid="app-header"
      className="rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 px-4 py-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="m-0 text-[1.15em] font-semibold leading-tight text-slate-900">
            {t.app.title}
          </h1>
          <p className="m-0 mt-1 text-sm font-medium text-slate-600 sm:text-[0.92rem]">
            {t.app.subtitle}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            id="start-tour-button"
            data-testid="start-tour-button"
            type="button"
            onClick={onStartTour}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            <Compass size={12} />
            <span>{t.tour.start}</span>
          </button>
          <div className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 p-0.5">
            {LOCALES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setLocale(key)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
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
      </div>
    </header>
  );
};
