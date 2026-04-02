import { useEffect, useState } from "react";

const getTimezone = (): string => {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const h = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const m = Math.abs(offset) % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
};

const formatClock = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

type LiveClock = { time: string; timezone: string };

export const useLiveClock = (): LiveClock => {
  const [time, setTime] = useState(() => formatClock(new Date()));
  const [timezone] = useState(getTimezone);

  useEffect(() => {
    const id = setInterval(() => setTime(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return { time, timezone };
};
