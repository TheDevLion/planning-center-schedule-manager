import { Plus, X } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";

type EditScheduleHeaderProps = {
  onAdd: () => void;
  onClose: () => void;
};

export const EditScheduleHeader = ({ onAdd, onClose }: EditScheduleHeaderProps): JSX.Element => {
  const t = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
      <h2 className="m-0 text-lg font-semibold text-slate-900">{t.edit.title}</h2>
      <div className="inline-flex items-center gap-2">
        <button
          id="add-activity-button"
          data-testid="add-activity-button"
          onClick={onAdd}
          className="inline-flex min-h-9 items-center gap-1 rounded-[10px] border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-indigo-50"
        >
          <Plus size={16} />
          <span>{t.edit.addActivity}</span>
        </button>
        <button
          id="close-edit-modal-button"
          data-testid="close-edit-modal-button"
          type="button"
          aria-label={t.edit.close}
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-300 bg-slate-50 text-slate-900 transition hover:border-slate-400 hover:bg-indigo-50 sm:h-[34px] sm:w-[34px]"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
