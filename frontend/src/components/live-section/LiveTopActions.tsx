import { ClipboardList } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { ControlButton } from "../ui/ControlButton";

export const LiveTopActions = (): JSX.Element => {
  const t = useTranslation();
  const error = useScheduleStore((s) => s.error);
  const setIsEditModalOpen = useScheduleStore((s) => s.setIsEditModalOpen);

  return (
    <div className="grid shrink-0 gap-1">
      <ControlButton
        id="edit-button"
        dataTestId="edit-button"
        ariaLabel={t.controls.editSchedule}
        title={t.controls.editSchedule}
        onClick={() => setIsEditModalOpen(true)}
        variant="square"
        icon={<ClipboardList size={16} />}
      />
      {error && (
        <span className="text-right text-[0.84rem] text-red-600">{error}</span>
      )}
    </div>
  );
};
