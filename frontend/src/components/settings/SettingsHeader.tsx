import { X } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";

type SettingsHeaderProps = {
  onClose: () => void;
};

export const SettingsHeader = ({ onClose }: SettingsHeaderProps): JSX.Element => {
  const t = useTranslation();

  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
      <h2 className="m-0 text-lg font-semibold text-slate-900">{t.settings.title}</h2>
      <button
        id="close-settings-button"
        data-testid="close-settings-button"
        type="button"
        aria-label={t.settings.close}
        onClick={onClose}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-300 bg-slate-50 text-slate-900 transition hover:border-slate-400 hover:bg-indigo-50"
      >
        <X size={16} />
      </button>
    </div>
  );
};
