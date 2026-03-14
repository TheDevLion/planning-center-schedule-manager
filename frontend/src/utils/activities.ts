import type { Activity, ApiActivity, FocusSlot } from "../types/schedule";

export const DEFAULT_ACTIVITY: Omit<Activity, "id" | "responsible"> = {
  title: "New activity",
  durationValue: "",
};

export const MOVE_HINT_TTL_MS = 5000;
export const FOCUS_WINDOW_SIZE = 4;

export const normalizeActivities = (items: ApiActivity[]): Activity[] =>
  items.map((item, index) => ({
    id: `${Date.now()}-${index}`,
    title: item.title ?? item.name ?? "Activity",
    durationValue: item.duration_raw ?? item.durationValue ?? "",
    responsible: item.responsible ?? "",
  }));

export const reorderItems = (
  items: Activity[],
  sourceIndex: number,
  targetIndex: number
): Activity[] => {
  if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) return items;
  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
};

export const reorderCurrentIndex = (
  currentIndex: number,
  sourceIndex: number,
  targetIndex: number
): number => {
  if (sourceIndex === targetIndex) return currentIndex;
  if (currentIndex === sourceIndex) return targetIndex;
  if (sourceIndex < currentIndex && targetIndex >= currentIndex) return currentIndex - 1;
  if (sourceIndex > currentIndex && targetIndex <= currentIndex) return currentIndex + 1;
  return currentIndex;
};

export const buildFocusedSlots = (activities: Activity[], viewIndex: number): FocusSlot[] => {
  if (activities.length === 0) return [];

  let start = Math.max(viewIndex - 1, 0);
  let end = start + FOCUS_WINDOW_SIZE;
  if (end > activities.length) {
    end = activities.length;
    start = Math.max(0, end - FOCUS_WINDOW_SIZE);
  }

  const slots: FocusSlot[] = activities.slice(start, end).map((activity, offset) => ({
    activity,
    absoluteIndex: start + offset,
  }));

  while (slots.length < FOCUS_WINDOW_SIZE) {
    slots.push({ activity: null, absoluteIndex: -1 });
  }

  return slots;
};
