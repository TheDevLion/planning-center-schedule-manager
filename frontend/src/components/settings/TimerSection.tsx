import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { ToggleSwitch } from "../ui/ToggleSwitch";

export const TimerSection = (): JSX.Element => {
  const t = useTranslation();
  const autoAdvance = useScheduleStore((s) => s.autoAdvance);
  const setAutoAdvance = useScheduleStore((s) => s.setAutoAdvance);

  return (
    <div className="grid gap-2">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-slate-500">
        {t.settings.timer}
      </span>
      <div className="flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5">
        <div className="grid gap-0.5">
          <span className="text-sm font-medium text-slate-900">{t.settings.autoAdvance}</span>
          <span className="text-xs text-slate-500">{t.settings.autoAdvanceDescription}</span>
        </div>
        <ToggleSwitch
          id="auto-advance-toggle"
          checked={autoAdvance}
          onChange={setAutoAdvance}
          ariaLabel={t.settings.autoAdvance}
        />
      </div>
    </div>
  );
};
