import { useMemo } from "react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { formatTime } from "../../utils/time";

export const LiveSummary = (): JSX.Element => {
  const t = useTranslation();
  const activities = useScheduleStore((s) => s.activities);
  const liveIndex = useScheduleStore((s) => s.liveIndex);
  const totalSeconds = useScheduleStore((s) => s.totalSeconds);

  const currentLiveTitle = activities[liveIndex]?.title || "-";
  const livePositionLabel = activities.length > 0 ? `${liveIndex + 1}/${activities.length}` : "0/0";

  const liveResponsible = useMemo(() => {
    const responsible = activities[liveIndex]?.responsible?.trim();
    return responsible || t.live.unassigned;
  }, [activities, liveIndex, t.live.unassigned]);

  return (
    <>
      <div className="pr-24">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-[0.86rem] text-slate-600">{t.live.activity}</h3>
          <span
            id="live-position-indicator"
            data-testid="live-position-indicator"
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.72rem] font-semibold text-slate-700"
          >
            {livePositionLabel}
          </span>
        </div>
        <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[1.05rem] leading-tight text-slate-900 sm:text-[1.9rem]">
          {currentLiveTitle}
        </strong>
      </div>

      <div className="flex min-w-0 items-end gap-2">
        <div className="min-w-0">
          <h3 className="m-0 text-[0.72rem] uppercase tracking-[0.03em] text-slate-600">{t.live.responsible}</h3>
          <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[0.92rem] text-slate-900 sm:text-base">
            {liveResponsible}
          </strong>
        </div>

        <div className="ml-auto text-right">
          <h3 className="m-0 text-[0.72rem] uppercase tracking-[0.03em] text-slate-600">{t.live.overallTimer}</h3>
          <strong
            id="overall-timer"
            data-testid="overall-timer"
            className="block text-[1.1rem] text-slate-900 sm:text-[1.25rem]"
          >
            {formatTime(totalSeconds)}
          </strong>
        </div>
      </div>
    </>
  );
};
