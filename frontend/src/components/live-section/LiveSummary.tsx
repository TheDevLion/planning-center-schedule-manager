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
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <h3 className="m-0 text-sm text-txt-secondary">{t.live.activity}</h3>
        <span
          id="live-position-indicator"
          data-testid="live-position-indicator"
          className="rounded-full bg-card-alt px-2 py-0.5 text-xs font-semibold text-txt-secondary"
        >
          {livePositionLabel}
        </span>
      </div>
      <strong className="block truncate text-base leading-tight text-txt md:text-[1.9rem]">
        {currentLiveTitle}
      </strong>

      <div className="flex min-w-0 items-end gap-2">
        <div className="min-w-0">
          <h3 className="m-0 text-xs uppercase tracking-[0.03em] text-txt-secondary">{t.live.responsible}</h3>
          <strong className="block truncate text-[0.94rem] text-txt sm:text-base">
            {liveResponsible}
          </strong>
        </div>

        <div className="ml-auto shrink-0 text-right">
          <h3 className="m-0 text-xs uppercase tracking-[0.03em] text-txt-secondary">{t.live.overallTimer}</h3>
          <strong
            id="overall-timer"
            data-testid="overall-timer"
            className="block text-lg text-txt sm:text-xl"
          >
            {formatTime(totalSeconds)}
          </strong>
        </div>
      </div>
    </div>
  );
};
