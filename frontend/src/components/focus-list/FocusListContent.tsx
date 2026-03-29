import { useMemo } from "react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { buildFocusedSlots } from "../../utils/activities";
import { FocusActivityRow } from "./FocusActivityRow";
import { FocusPlaceholderRow } from "./FocusPlaceholderRow";
import { FocusSkeletonRow } from "./FocusSkeletonRow";

export const FocusListContent = (): JSX.Element => {
  const t = useTranslation();
  const isLoading = useScheduleStore((s) => s.isLoading);
  const activities = useScheduleStore((s) => s.activities);
  const viewIndex = useScheduleStore((s) => s.viewIndex);

  const focusedSlots = useMemo(() => buildFocusedSlots(activities, viewIndex), [activities, viewIndex]);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <FocusSkeletonRow key={`skeleton-${index}`} />
        ))}
      </>
    );
  }

  if (activities.length === 0) {
    return (
      <p id="empty-activities" data-testid="empty-activities" className="py-2 text-txt-secondary">
        {t.focus.noActivities}
      </p>
    );
  }

  return (
    <>
      {focusedSlots.map(({ activity, absoluteIndex }, slotIndex) =>
        activity ? (
          <FocusActivityRow
            key={activity.id}
            activity={activity}
            absoluteIndex={absoluteIndex}
          />
        ) : (
          <FocusPlaceholderRow key={`placeholder-${slotIndex}`} />
        )
      )}
    </>
  );
};
