import { useEffect } from "react";

import { AppHeader } from "./components/AppHeader";
import { EditScheduleModal } from "./components/EditScheduleModal";
import { FocusList } from "./components/FocusList";
import { LiveSection } from "./components/LiveSection";
import { useScheduleTimer } from "./hooks/useScheduleTimer";
import { useScheduleStore } from "./store/scheduleStore";

export default function App(): JSX.Element {
  useScheduleTimer();

  useEffect(() => {
    useScheduleStore.getState().importFromUrl();
  }, []);

  return (
    <div
      id="app-root"
      data-testid="app-root"
      className="mx-auto flex w-full min-w-0 max-w-[1080px] flex-col overflow-hidden px-2 pb-10 pt-1 md:gap-4 md:px-5 md:pt-3"
    >
      <AppHeader />
      <LiveSection />
      <FocusList />
      <EditScheduleModal />
    </div>
  );
}
