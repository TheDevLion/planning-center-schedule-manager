import type { FocusEvent } from "react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import type { Activity } from "../../types/schedule";
import { DURATION_PARTIAL_RE, normalizeDurationInput } from "../../utils/durationInput";
import { DurationInputField } from "./DurationInputField";
import { RowActionButtons } from "./RowActionButtons";
import { TitleInputField } from "./TitleInputField";

type EditScheduleRowProps = {
  activity: Activity;
  index: number;
  totalActivities: number;
};

export const EditScheduleRow = ({
  activity,
  index,
  totalActivities,
}: EditScheduleRowProps): JSX.Element => {
  const t = useTranslation();
  const moveHint = useScheduleStore((s) => s.moveHints[activity.id]);
  const updateActivity = useScheduleStore((s) => s.updateActivity);
  const moveActivity = useScheduleStore((s) => s.moveActivity);
  const removeActivity = useScheduleStore((s) => s.removeActivity);

  const handleDurationChange = (value: string): void => {
    if (!DURATION_PARTIAL_RE.test(value)) return;
    updateActivity(activity.id, "durationValue", value);
  };

  const handleDurationBlur = (value: string, event: FocusEvent<HTMLInputElement>): void => {
    const normalized = normalizeDurationInput(value);
    const isValid = normalized !== null;
    event.currentTarget.setCustomValidity(isValid ? "" : t.edit.durationValidation);
    if (!isValid) {
      updateActivity(activity.id, "durationValue", "");
      return;
    }
    if (normalized !== value) {
      updateActivity(activity.id, "durationValue", normalized);
    }
  };

  return (
    <div
      id={`edit-row-${activity.id}`}
      data-testid={`edit-row-${index}`}
      className="rounded-[10px] border border-border bg-card p-2.5"
    >
      <div className="grid gap-2 sm:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border text-sm">
            {index + 1}
          </span>
          <TitleInputField
            activityId={activity.id}
            index={index}
            value={activity.title}
            moveHint={moveHint}
            onChange={(value) => updateActivity(activity.id, "title", value)}
          />
        </div>

        <div className="flex min-w-0 items-center gap-1.5">
          <input
            id={`responsible-input-${activity.id}`}
            data-testid={`responsible-input-${index}`}
            value={activity.responsible}
            onChange={(e) => updateActivity(activity.id, "responsible", e.target.value)}
            placeholder={t.edit.responsible}
            className="h-7 min-w-0 flex-1 truncate rounded-full border border-border bg-card px-2 text-center text-xs font-semibold text-responsible-text outline-none"
          />
          <DurationInputField
            activityId={activity.id}
            index={index}
            value={activity.durationValue}
            onChange={handleDurationChange}
            onBlur={handleDurationBlur}
            className="h-7 w-[76px] shrink-0 rounded-full border border-border bg-card px-2 text-center text-sm font-semibold text-txt-secondary outline-none"
          />
        </div>
        <div className="flex items-center justify-end">
          <RowActionButtons
            activityId={activity.id}
            index={index}
            total={totalActivities}
            onMove={moveActivity}
            onRemove={removeActivity}
          />
        </div>
      </div>

      <div className="hidden grid-cols-[32px_minmax(0,1fr)_88px_auto] items-center gap-2.5 sm:grid">
        <div className="relative h-8 w-8">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-sm">
            {index + 1}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2.5">
          <TitleInputField
            activityId={activity.id}
            index={index}
            value={activity.title}
            moveHint={moveHint}
            onChange={(value) => updateActivity(activity.id, "title", value)}
          />
          <input
            id={`responsible-input-desktop-${activity.id}`}
            data-testid={`responsible-input-desktop-${index}`}
            value={activity.responsible}
            onChange={(e) => updateActivity(activity.id, "responsible", e.target.value)}
            placeholder={t.edit.responsible}
            className="w-28 shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-center text-xs font-semibold text-responsible-text outline-none"
          />
        </div>

        <DurationInputField
          activityId={activity.id}
          index={index}
          value={activity.durationValue}
          onChange={handleDurationChange}
          onBlur={handleDurationBlur}
          className="min-h-10 w-full rounded-lg border border-border-strong px-2.5 py-2 text-sm text-txt outline-none"
        />

        <div className="flex flex-wrap items-center gap-1.5">
          <RowActionButtons
            activityId={activity.id}
            index={index}
            total={totalActivities}
            onMove={moveActivity}
            onRemove={removeActivity}
          />
        </div>
      </div>
    </div>
  );
};
