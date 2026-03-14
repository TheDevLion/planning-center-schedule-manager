import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import type { Activity } from "../../types/schedule";
import { formatTime } from "../../utils/time";

const rowClassByState = ({ isLive, isViewed }: { isLive: boolean; isViewed: boolean }): string => {
  if (isLive && isViewed) return "border-green-500 bg-emerald-50 shadow-[0_0_0_2px_rgba(34,197,94,0.15)]";
  if (isLive) return "border-green-300 bg-green-50";
  if (isViewed) return "border-amber-300 bg-amber-50";
  return "border-slate-200 bg-slate-50";
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
      className={`relative flex min-h-[58px] items-center gap-3 rounded-[10px] border px-2.5 py-2 sm:min-h-16 sm:px-3 sm:py-2.5 ${rowClass}`}
    >
      {isLive && isViewed ? (
        <span className="absolute bottom-2 left-0 top-2 w-1 rounded bg-green-600" aria-hidden />
      ) : null}
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
        {absoluteIndex + 1}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <strong className="truncate text-[0.95rem] leading-tight text-slate-900">{activity.title}</strong>
          {isLive && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[0.68rem] font-bold text-green-800">
              {t.focus.live}
            </span>
          )}
          {isViewed && !isLive && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[0.68rem] font-bold text-blue-700">
              {t.focus.view}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {activity.responsible && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[0.72rem] font-semibold text-red-800">
              {activity.responsible}
            </span>
          )}
          {activity.durationValue && (
            <span className="text-[0.75rem] font-semibold text-slate-700">{activity.durationValue}</span>
          )}
          {isLive ? (
            <span className="text-[0.72rem] font-bold text-teal-700">{t.focus.actual} {formatTime(liveActivitySeconds)}</span>
          ) : actualSeconds !== undefined ? (
            <span className="text-[0.72rem] font-semibold text-slate-700">
              {t.focus.actual} {formatTime(actualSeconds)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
