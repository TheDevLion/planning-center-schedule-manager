import { useRef } from "react";

import { useTranslation } from "../i18n/i18nStore";
import { useScheduleStore } from "../store/scheduleStore";
import { EditScheduleHeader } from "./edit-schedule/EditScheduleHeader";
import { EditScheduleRow } from "./edit-schedule/EditScheduleRow";

export const EditScheduleModal = (): JSX.Element | null => {
  const t = useTranslation();
  const isOpen = useScheduleStore((s) => s.isEditModalOpen);
  const activities = useScheduleStore((s) => s.activities);
  const setIsEditModalOpen = useScheduleStore((s) => s.setIsEditModalOpen);
  const addActivity = useScheduleStore((s) => s.addActivity);

  const modalPanelRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const onClose = () => setIsEditModalOpen(false);

  return (
    <div
      id="edit-modal-backdrop"
      data-testid="edit-modal-backdrop"
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 p-3 sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        id="edit-modal"
        data-testid="edit-modal"
        ref={modalPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.edit.title}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[1120px] flex-col gap-2 overflow-y-auto rounded-2xl bg-white p-3 shadow-[0_22px_48px_rgba(15,23,42,0.22)] [overflow-anchor:none] sm:max-h-[86vh] sm:rounded-[14px] sm:p-4"
      >
        <EditScheduleHeader onAdd={addActivity} onClose={onClose} />

        <div className="grid gap-2.5 pb-2">
          {activities.map((activity, index) => (
            <EditScheduleRow
              key={activity.id}
              activity={activity}
              index={index}
              totalActivities={activities.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
