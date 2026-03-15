import { Check, ClipboardList, Share2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { buildShareUrl } from "../../utils/scheduleUrl";
import { ControlButton } from "../ui/ControlButton";

export const LiveTopActions = (): JSX.Element => {
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const error = useScheduleStore((s) => s.error);
  const activities = useScheduleStore((s) => s.activities);
  const uploadFile = useScheduleStore((s) => s.uploadFile);
  const setIsEditModalOpen = useScheduleStore((s) => s.setIsEditModalOpen);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    event.target.value = "";
  };

  const handleShare = async (): Promise<void> => {
    if (activities.length === 0) return;
    const url = buildShareUrl(activities);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid shrink-0 grid-cols-3 gap-1 sm:gap-2">
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
        id="share-button"
        dataTestId="share-button"
        ariaLabel={t.controls.shareSchedule}
        title={copied ? t.controls.linkCopied : t.controls.shareSchedule}
        onClick={handleShare}
        disabled={activities.length === 0}
        variant="square"
        icon={copied ? <Check size={16} /> : <Share2 size={16} />}
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
        <span className="col-span-3 text-right text-[0.82rem] text-red-600">{error}</span>
      )}
    </div>
  );
};
