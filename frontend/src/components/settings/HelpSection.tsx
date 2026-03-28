import { Compass } from "lucide-react";

import { useTranslation } from "../../i18n/i18nStore";

type HelpSectionProps = {
  onStartTour: () => void;
};

export const HelpSection = ({ onStartTour }: HelpSectionProps): JSX.Element => {
  const t = useTranslation();

  return (
    <div className="grid gap-1">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-slate-500">
        {t.settings.help}
      </span>
      <button
        id="start-tour-button"
        data-testid="start-tour-button"
        type="button"
        onClick={onStartTour}
        className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 active:bg-slate-100"
      >
        <Compass size={16} className="text-slate-500" />
        <span>{t.settings.startTour}</span>
      </button>
    </div>
  );
};
