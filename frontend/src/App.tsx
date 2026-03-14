import { AppHeader } from "./components/AppHeader";
import { EditScheduleModal } from "./components/EditScheduleModal";
import { FocusList } from "./components/FocusList";
import { LiveSection } from "./components/LiveSection";
import { useScheduleTimer } from "./hooks/useScheduleTimer";

export default function App(): JSX.Element {
  useScheduleTimer();

  return (
    <div
      id="app-root"
      data-testid="app-root"
      className="mx-auto flex w-full max-w-[1080px] flex-col gap-3 px-3 pb-10 pt-2 sm:gap-4 sm:px-5 sm:pt-3"
    >
      <AppHeader />
      <LiveSection />
      <FocusList />
      <EditScheduleModal />
    </div>
  );
}
