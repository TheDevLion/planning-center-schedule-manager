import { Check, Loader2, Share2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { useTranslation } from "../../i18n/i18nStore";
import { useScheduleStore } from "../../store/scheduleStore";
import { buildShareUrl } from "../../utils/scheduleUrl";

export const ScheduleSection = (): JSX.Element => {
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const activities = useScheduleStore((s) => s.activities);
  const isLoading = useScheduleStore((s) => s.isLoading);
  const error = useScheduleStore((s) => s.error);
  const uploadFile = useScheduleStore((s) => s.uploadFile);

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
    <div className="grid gap-1">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-slate-500">
        {t.settings.schedule}
      </span>

      <button
        id="import-button"
        data-testid="import-button"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin text-slate-500" /> : <Upload size={16} className="text-slate-500" />}
        <span>{t.settings.importFile}</span>
      </button>

      <input
        id="upload-input"
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleUpload}
        className="hidden"
      />

      <button
        id="share-button"
        data-testid="share-button"
        type="button"
        onClick={handleShare}
        disabled={activities.length === 0}
        className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Share2 size={16} className="text-slate-500" />
        )}
        <span>{copied ? t.settings.linkCopied : t.settings.shareSchedule}</span>
      </button>

      {error && (
        <span className="px-3 text-[0.82rem] text-red-600">{error}</span>
      )}
    </div>
  );
};
