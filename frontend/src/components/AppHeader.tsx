import { Settings } from "lucide-react";

import { useLiveClock } from "../hooks/useLiveClock";
import { useTranslation } from "../i18n/i18nStore";
import { useScheduleStore } from "../store/scheduleStore";

export const AppHeader = (): JSX.Element => {
  const t = useTranslation();
  const { time, timezone } = useLiveClock();
  const setIsSettingsOpen = useScheduleStore((s) => s.setIsSettingsOpen);

  return (
    <header
      id="app-header"
      data-testid="app-header"
      className="rounded-xl border border-header-border bg-gradient-to-br from-header-from to-header-to px-4 py-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="m-0 text-lg font-semibold leading-tight text-txt">
            {t.app.title}
          </h1>
          <span className="rounded-full bg-black/10 px-2.5 py-0.5 font-mono text-sm font-semibold tabular-nums text-txt-secondary">
            {time} <span className="text-xs font-normal text-txt-tertiary">{timezone}</span>
          </span>
        </div>
        <button
          id="settings-button"
          data-testid="settings-button"
          type="button"
          aria-label={t.settings.title}
          onClick={() => setIsSettingsOpen(true)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-btn-border bg-btn-bg text-brand shadow-sm transition hover:border-btn-hover-border hover:bg-btn-hover-bg"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
