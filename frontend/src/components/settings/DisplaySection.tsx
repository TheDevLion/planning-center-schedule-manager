import { useTranslation } from "../../i18n/i18nStore";
import { useFullscreen } from "../../hooks/useFullscreen";
import { ToggleSwitch } from "../ui/ToggleSwitch";

export const DisplaySection = (): JSX.Element => {
  const t = useTranslation();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-txt-tertiary">
        {t.settings.display}
      </span>
      <div className="flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5">
        <div className="grid gap-0.5">
          <span className="text-sm font-medium text-txt">{t.settings.fullscreen}</span>
          <span className="text-xs text-txt-tertiary">{t.settings.fullscreenDescription}</span>
        </div>
        <ToggleSwitch
          id="fullscreen-toggle"
          checked={isFullscreen}
          onChange={toggleFullscreen}
          ariaLabel={t.settings.fullscreen}
        />
      </div>
    </div>
  );
};
