import { create } from "zustand";

import {
  concludeTransition,
  moveTransition,
  removeTransition,
  reopenTransition,
} from "../state/scheduleTransitions";
import { getTranslation } from "../i18n/i18nStore";
import { parseScheduleFile } from "../services/scheduleApi";
import { DEFAULT_ACTIVITY, MOVE_HINT_TTL_MS, normalizeActivities } from "../utils/activities";
import { parseDurationToSeconds } from "../utils/time";
import type { Activity, MoveDirection, MoveHints, RuntimeState, TimelineState } from "../types/schedule";

type ScheduleState = {
  activities: Activity[];
  liveIndex: number;
  viewIndex: number;
  actualSecondsById: Record<string, number>;

  isRunning: boolean;
  totalSeconds: number;
  liveActivitySeconds: number;

  isEditModalOpen: boolean;
  moveHints: MoveHints;
  isLoading: boolean;
  error: string;
};

type ScheduleActions = {
  uploadFile: (file: File) => Promise<void>;
  tick: () => void;
  toggleRunning: () => void;
  concludeLiveActivity: () => void;
  reopenViewedAsLive: () => void;
  viewPrev: () => void;
  viewNext: () => void;
  focusLive: () => void;
  addActivity: () => void;
  updateActivity: (id: string, key: "title" | "durationValue" | "responsible", value: string) => void;
  removeActivity: (id: string) => void;
  moveActivity: (index: number, direction: number) => void;
  setIsEditModalOpen: (open: boolean) => void;
};

const toTimeline = (s: ScheduleState): TimelineState => ({
  activities: s.activities,
  liveIndex: s.liveIndex,
  viewIndex: s.viewIndex,
  actualSecondsById: s.actualSecondsById,
});

const toRuntime = (s: ScheduleState): RuntimeState => ({
  isRunning: s.isRunning,
  totalSeconds: s.totalSeconds,
  liveActivitySeconds: s.liveActivitySeconds,
});

export type ScheduleStore = ScheduleState & ScheduleActions;

export const useScheduleStore = create<ScheduleStore>()((set, get) => ({
  activities: [],
  liveIndex: 0,
  viewIndex: 0,
  actualSecondsById: {},
  isRunning: false,
  totalSeconds: 0,
  liveActivitySeconds: 0,
  isEditModalOpen: false,
  moveHints: {},
  isLoading: false,
  error: "",

  uploadFile: async (file) => {
    set({ isLoading: true, error: "" });
    try {
      const payload = await parseScheduleFile(file);
      set({
        activities: normalizeActivities(payload.activities || []),
        liveIndex: 0,
        viewIndex: 0,
        actualSecondsById: {},
        isRunning: false,
        totalSeconds: 0,
        liveActivitySeconds: 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : getTranslation().errors.ocrFailed;
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  tick: () => {
    const state = get();
    const newTotal = state.totalSeconds + 1;
    const newLiveSeconds = state.liveActivitySeconds + 1;

    const current = state.activities[state.liveIndex];
    if (current) {
      const duration = parseDurationToSeconds(current.durationValue);
      if (duration && state.liveActivitySeconds < duration && newLiveSeconds >= duration) {
        const transition = concludeTransition({
          timeline: toTimeline(state),
          runtime: { ...toRuntime(state), totalSeconds: newTotal, liveActivitySeconds: newLiveSeconds },
        });
        if (transition) {
          set({ ...transition.timeline, ...transition.runtime });
          return;
        }
      }
    }

    set({ totalSeconds: newTotal, liveActivitySeconds: newLiveSeconds });
  },

  toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),

  concludeLiveActivity: () => {
    const s = get();
    const transition = concludeTransition({ timeline: toTimeline(s), runtime: toRuntime(s) });
    if (transition) set({ ...transition.timeline, ...transition.runtime });
  },

  reopenViewedAsLive: () => {
    const s = get();
    const transition = reopenTransition({ timeline: toTimeline(s), runtime: toRuntime(s) });
    if (transition) set({ ...transition.timeline, ...transition.runtime });
  },

  viewPrev: () => set((s) => ({ viewIndex: Math.max(s.viewIndex - 1, 0) })),

  viewNext: () =>
    set((s) => ({
      viewIndex: s.activities.length === 0 ? 0 : Math.min(s.viewIndex + 1, s.activities.length - 1),
    })),

  focusLive: () => set((s) => ({ viewIndex: s.liveIndex })),

  addActivity: () =>
    set((s) => ({
      activities: [...s.activities, { id: `${Date.now()}`, ...DEFAULT_ACTIVITY, responsible: "" }],
    })),

  updateActivity: (id, key, value) =>
    set((s) => ({
      activities: s.activities.map((a) => (a.id === id ? { ...a, [key]: value } : a)),
    })),

  removeActivity: (id) => {
    const s = get();
    const transition = removeTransition({ timeline: toTimeline(s), id });
    if (!transition) return;
    set({ ...transition.timeline, ...(transition.removedWasLive ? { liveActivitySeconds: 0 } : {}) });
  },

  moveActivity: (index, direction) => {
    const s = get();
    const transition = moveTransition({ timeline: toTimeline(s), index, direction });
    if (!transition) return;

    const movedId = transition.movedItemId;
    const swappedId = transition.swappedItemId;
    const dir: MoveDirection = direction < 0 ? "up" : "down";
    const opposite: MoveDirection = direction < 0 ? "down" : "up";

    set({
      ...transition.timeline,
      moveHints: {
        ...s.moveHints,
        ...(movedId ? { [movedId]: dir } : {}),
        ...(swappedId ? { [swappedId]: opposite } : {}),
      },
    });

    setTimeout(() => {
      set((prev) => {
        const next = { ...prev.moveHints };
        if (movedId) delete next[movedId];
        if (swappedId) delete next[swappedId];
        return { moveHints: next };
      });
    }, MOVE_HINT_TTL_MS);
  },

  setIsEditModalOpen: (open) => set({ isEditModalOpen: open }),
}));
