import { ClipboardList, Upload } from "lucide-react";
import { useRef } from "react";
import type { ChangeEvent } from "react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { ControlButton } from "../ui/ControlButton";

export const LiveTopActions = (): JSX.Element => {
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const error = useScheduleStore((s) => s.error);
  const uploadFile = useScheduleStore((s) => s.uploadFile);
  const setIsEditModalOpen = useScheduleStore((s) => s.setIsEditModalOpen);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    event.target.value = "";
  };

  return (
    <div className="absolute right-0 top-0 z-10 grid grid-cols-2 items-center gap-2">
      <ControlButton
        id="import-button"
        dataTestId="import-button"
        ariaLabel={t.controls.importFile}
        title={t.controls.import}
        onClick={() => fileInputRef.current?.click()}
        variant="square"
        icon={<Upload size={16} />}
      />
      <ControlButton
        id="edit-button"
        dataTestId="edit-button"
        ariaLabel={t.controls.editSchedule}
        title={t.controls.editSchedule}
        onClick={() => setIsEditModalOpen(true)}
        variant="square"
        icon={<ClipboardList size={16} />}
      />
      <input
        id="upload-input"
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleUpload}
        className="hidden"
      />
      {error && (
        <span className="col-span-2 justify-self-end text-right text-[0.82rem] text-red-600">{error}</span>
      )}
    </div>
  );
};
