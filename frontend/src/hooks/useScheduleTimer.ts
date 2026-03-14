import { useEffect } from "react";

import { useScheduleStore } from "../store/scheduleStore";

export const useScheduleTimer = (): void => {
  const isRunning = useScheduleStore((s) => s.isRunning);
  const tick = useScheduleStore((s) => s.tick);

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);
};
