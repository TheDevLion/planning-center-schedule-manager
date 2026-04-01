import { useEffect } from "react";

import { useTranslation } from "../i18n/i18nStore";
import { useScheduleStore } from "../store/scheduleStore";
import { useGuidedTour } from "../hooks/useGuidedTour";
import { SettingsHeader } from "./settings/SettingsHeader";
import { LanguageSection } from "./settings/LanguageSection";
import { ScheduleSection } from "./settings/ScheduleSection";
import { TimerSection } from "./settings/TimerSection";
import { DisplaySection } from "./settings/DisplaySection";
import { HelpSection } from "./settings/HelpSection";

export const SettingsModal = (): JSX.Element | null => {
  const t = useTranslation();
  const isOpen = useScheduleStore((s) => s.isSettingsOpen);
  const setIsSettingsOpen = useScheduleStore((s) => s.setIsSettingsOpen);
  const { startTour } = useGuidedTour();

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSettingsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, setIsSettingsOpen]);

  if (!isOpen) return null;

  const onClose = () => setIsSettingsOpen(false);

  const handleStartTour = () => {
    setIsSettingsOpen(false);
    setTimeout(() => startTour(), 150);
  };

  return (
    <div
      id="settings-modal-backdrop"
      data-testid="settings-modal-backdrop"
      className="fixed inset-0 z-40 flex items-start justify-center bg-black/50 p-3 pt-12 sm:items-center sm:pt-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        id="settings-modal"
        data-testid="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t.settings.title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100dvh-4rem)] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-2xl bg-card p-4 shadow-[0_22px_48px_rgba(15,23,42,0.22)] sm:max-h-[86vh]"
      >
        <SettingsHeader onClose={onClose} />
        <LanguageSection />
        <div className="border-t border-border" />
        <ScheduleSection />
        <div className="border-t border-border" />
        <TimerSection />
        <div className="border-t border-border" />
        <DisplaySection />
        <div className="border-t border-border" />
        <HelpSection onStartTour={handleStartTour} />
      </div>
    </div>
  );
};
