import { X } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";

type SettingsHeaderProps = {
  onClose: () => void;
};

export const SettingsHeader = ({ onClose }: SettingsHeaderProps): JSX.Element => {
  const t = useTranslation();

  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <h2 className="m-0 text-lg font-semibold text-txt">{t.settings.title}</h2>
      <button
        id="close-settings-button"
        data-testid="close-settings-button"
        type="button"
        aria-label={t.settings.close}
        onClick={onClose}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-btn-border bg-btn-bg text-brand shadow-sm transition hover:border-btn-hover-border hover:bg-btn-hover-bg"
      >
        <X size={16} />
      </button>
    </div>
  );
};
