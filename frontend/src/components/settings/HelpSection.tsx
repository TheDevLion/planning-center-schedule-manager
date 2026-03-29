import { Compass } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";

type HelpSectionProps = {
  onStartTour: () => void;
};

export const HelpSection = ({ onStartTour }: HelpSectionProps): JSX.Element => {
  const t = useTranslation();

  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-txt-tertiary">
        {t.settings.help}
      </span>
      <button
        id="start-tour-button"
        data-testid="start-tour-button"
        type="button"
        onClick={onStartTour}
        className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-txt transition hover:bg-card-alt active:bg-slate-100"
      >
        <Compass size={16} className="text-txt-tertiary" />
        <span>{t.settings.startTour}</span>
      </button>
    </div>
  );
};
