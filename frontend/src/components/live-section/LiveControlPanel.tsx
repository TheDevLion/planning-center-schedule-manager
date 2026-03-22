import { ChevronLeft, ChevronRight, CircleDot, Pause, Play, StepForward, Undo2 } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { ControlButton } from "../ui/ControlButton";

export const LiveControlPanel = (): JSX.Element => {
  const t = useTranslation();
  const activitiesCount = useScheduleStore((s) => s.activities.length);
  const liveIndex = useScheduleStore((s) => s.liveIndex);
  const viewIndex = useScheduleStore((s) => s.viewIndex);
  const isRunning = useScheduleStore((s) => s.isRunning);
  const toggleRunning = useScheduleStore((s) => s.toggleRunning);
  const concludeLiveActivity = useScheduleStore((s) => s.concludeLiveActivity);
  const viewPrev = useScheduleStore((s) => s.viewPrev);
  const viewNext = useScheduleStore((s) => s.viewNext);
  const focusLive = useScheduleStore((s) => s.focusLive);
  const reopenViewedAsLive = useScheduleStore((s) => s.reopenViewedAsLive);

  return (
    <div
      id="control-panel"
      data-testid="control-panel"
      className="mt-1 grid grid-cols-6 gap-1 md:mt-2 md:grid-cols-4 md:gap-2"
    >
      <ControlButton
        id="live-toggle-button"
        dataTestId="live-toggle-button"
        ariaLabel={isRunning ? t.controls.pause : t.controls.start}
        title={isRunning ? t.controls.pause : t.controls.start}
        onClick={toggleRunning}
        icon={isRunning ? <Pause size={16} /> : <Play size={16} />}
      />
      <ControlButton
        id="conclude-button"
        dataTestId="conclude-button"
        ariaLabel={t.controls.conclude}
        title={t.controls.conclude}
        onClick={concludeLiveActivity}
        disabled={liveIndex >= activitiesCount - 1}
        icon={<StepForward size={16} />}
      />
      <ControlButton
        id="view-prev-button"
        dataTestId="view-prev-button"
        ariaLabel={t.controls.viewPrevious}
        title={t.controls.viewPrevious}
        onClick={viewPrev}
        disabled={viewIndex === 0}
        icon={<ChevronLeft size={16} />}
      />
      <ControlButton
        id="view-next-button"
        dataTestId="view-next-button"
        ariaLabel={t.controls.viewNext}
        title={t.controls.viewNext}
        onClick={viewNext}
        disabled={viewIndex >= activitiesCount - 1}
        icon={<ChevronRight size={16} />}
      />
      <div className="md:col-span-2">
        <ControlButton
          id="focus-live-button"
          dataTestId="focus-live-button"
          ariaLabel={t.controls.backToLive}
          onClick={focusLive}
          disabled={viewIndex === liveIndex || activitiesCount === 0}
          icon={<CircleDot size={16} />}
          label={t.controls.backToLive}
        />
      </div>
      <div className="md:col-span-2">
        <ControlButton
          id="reopen-button"
          dataTestId="reopen-button"
          ariaLabel={t.controls.reopenAsLive}
          onClick={reopenViewedAsLive}
          disabled={activitiesCount === 0 || viewIndex === liveIndex}
          icon={<Undo2 size={16} />}
          label={t.controls.reopenAsLive}
        />
      </div>
    </div>
  );
};
