import { Settings } from "lucide-react";

import { useTranslation } from "../i18n/i18nStore";
import { useScheduleStore } from "../store/scheduleStore";

export const AppHeader = (): JSX.Element => {
  const t = useTranslation();
  const setIsSettingsOpen = useScheduleStore((s) => s.setIsSettingsOpen);

  return (
    <header
      id="app-header"
      data-testid="app-header"
      className="rounded-xl border border-header-border bg-gradient-to-br from-header-from to-header-to px-4 py-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="m-0 text-lg font-semibold leading-tight text-txt">
            {t.app.title}
          </h1>
        </div>
        <button
          id="settings-button"
          data-testid="settings-button"
          type="button"
          aria-label={t.settings.title}
          onClick={() => setIsSettingsOpen(true)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card-alt text-txt-secondary transition hover:border-border-strong hover:bg-card"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
