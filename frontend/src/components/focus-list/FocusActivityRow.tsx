import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import type { Activity } from "../../types/schedule";
import { formatTime } from "../../utils/time";

const rowClassByState = ({ isLive, isViewed }: { isLive: boolean; isViewed: boolean }): string => {
  if (isLive && isViewed) return "border-live-viewed-border bg-live-viewed-bg shadow-[0_0_0_2px_var(--live-viewed-shadow)]";
  if (isLive) return "border-live-border bg-live-bg";
  if (isViewed) return "border-viewed-border bg-viewed-bg";
  return "border-border bg-card-alt";
};

type FocusActivityRowProps = {
  activity: Activity;
  absoluteIndex: number;
};

export const FocusActivityRow = ({
  activity,
  absoluteIndex,
}: FocusActivityRowProps): JSX.Element => {
  const t = useTranslation();
  const liveIndex = useScheduleStore((s) => s.liveIndex);
  const viewIndex = useScheduleStore((s) => s.viewIndex);
  const liveActivitySeconds = useScheduleStore((s) => s.liveActivitySeconds);
  const actualSeconds = useScheduleStore((s) => s.actualSecondsById[activity.id]);

  const isLive = absoluteIndex === liveIndex;
  const isViewed = absoluteIndex === viewIndex;
  const rowClass = rowClassByState({ isLive, isViewed });

  return (
    <div
      id={`focus-row-${activity.id}`}
      data-testid={`focus-row-${absoluteIndex}`}
      key={activity.id}
      className={`relative flex min-h-[48px] min-w-0 items-center gap-2 overflow-hidden rounded-[10px] border px-2 py-2 md:min-h-16 md:gap-3 md:px-3 md:py-2.5 ${rowClass}`}
    >
      {isLive && isViewed ? (
        <span className="absolute bottom-2 left-0 top-2 w-1 rounded bg-live-accent" aria-hidden />
      ) : null}
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-number-bg text-xs font-semibold text-number-text md:h-8 md:w-8 md:text-sm">
        {absoluteIndex + 1}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <strong className="min-w-0 flex-1 truncate text-base leading-tight text-txt">{activity.title}</strong>
          {isLive && (
            <span className="shrink-0 rounded-full bg-live-badge-bg px-2 py-0.5 text-xs font-bold text-live-badge-text">
              {t.focus.live}
            </span>
          )}
          {isViewed && !isLive && (
            <span className="shrink-0 rounded-full bg-viewed-badge-bg px-2 py-0.5 text-xs font-bold text-viewed-badge-text">
              {t.focus.view}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {activity.responsible && (
            <span className="rounded-full bg-responsible-bg px-2 py-0.5 text-xs font-semibold text-responsible-text">
              {activity.responsible}
            </span>
          )}
          {activity.durationValue && (
            <span className="text-xs font-semibold text-txt-secondary">{activity.durationValue}</span>
          )}
          {isLive ? (
            <span className="text-xs font-bold text-teal-700">{t.focus.actual} {formatTime(liveActivitySeconds)}</span>
          ) : actualSeconds !== undefined ? (
            <span className="text-xs font-semibold text-txt-secondary">
              {t.focus.actual} {formatTime(actualSeconds)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
