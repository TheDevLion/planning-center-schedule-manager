export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
};

export const parseDurationToSeconds = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value).trim();

  if (/^\d+$/.test(text)) return Number(text) * 60;

  if (/^\d{1,3}:\d{2}$/.test(text)) {
    const [minutes, seconds] = text.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  if (/^\d{1,2}:\d{2}:\d{2}$/.test(text)) {
    const [hours, minutes, seconds] = text.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
};
