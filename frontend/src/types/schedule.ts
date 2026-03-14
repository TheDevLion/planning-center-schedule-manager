export type MoveDirection = "up" | "down";

export type Activity = {
  id: string;
  title: string;
  durationValue: string;
  responsible: string;
};

export type ApiActivity = {
  order?: number;
  title?: string;
  name?: string;
  responsible?: string | null;
  duration_raw?: string | null;
  durationValue?: string | null;
};

export type ScheduleParseResponse = {
  activities?: ApiActivity[];
};

export type FocusSlot = {
  activity: Activity | null;
  absoluteIndex: number;
};

export type TimelineState = {
  activities: Activity[];
  liveIndex: number;
  viewIndex: number;
  actualSecondsById: Record<string, number>;
};

export type RuntimeState = {
  isRunning: boolean;
  totalSeconds: number;
  liveActivitySeconds: number;
};

export type UploadState = {
  isLoading: boolean;
  error: string;
};

export type MoveHints = Record<string, MoveDirection>;
