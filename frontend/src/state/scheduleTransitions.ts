import { reorderCurrentIndex, reorderItems } from "../utils/activities";
import type { RuntimeState, TimelineState } from "../types/schedule";

type TransitionInput = {
  timeline: TimelineState;
  runtime: RuntimeState;
};

type TransitionOutput = {
  timeline: TimelineState;
  runtime: RuntimeState;
};

export const concludeTransition = ({
  timeline,
  runtime,
}: TransitionInput): TransitionOutput | null => {
  const { activities, liveIndex, actualSecondsById } = timeline;
  if (activities.length === 0) return null;

  const current = activities[liveIndex];
  const nextActualSecondsById = current
    ? { ...actualSecondsById, [current.id]: runtime.liveActivitySeconds }
    : actualSecondsById;

  if (liveIndex >= activities.length - 1) {
    return {
      timeline: { ...timeline, actualSecondsById: nextActualSecondsById },
      runtime: { ...runtime, isRunning: false, liveActivitySeconds: 0 },
    };
  }

  const nextIndex = liveIndex + 1;
  const nextActivity = activities[nextIndex];
  const nextLiveSeconds = nextActivity ? (nextActualSecondsById[nextActivity.id] ?? 0) : 0;

  return {
    timeline: {
      ...timeline,
      liveIndex: nextIndex,
      viewIndex: nextIndex,
      actualSecondsById: nextActualSecondsById,
    },
    runtime: { ...runtime, liveActivitySeconds: nextLiveSeconds },
  };
};

export const reopenTransition = ({
  timeline,
  runtime,
}: TransitionInput): TransitionOutput | null => {
  const { activities, liveIndex, viewIndex, actualSecondsById } = timeline;
  if (activities.length === 0 || viewIndex === liveIndex) return null;

  const currentLive = activities[liveIndex];
  const nextActualSecondsById = currentLive
    ? { ...actualSecondsById, [currentLive.id]: runtime.liveActivitySeconds }
    : actualSecondsById;
  const target = activities[viewIndex];
  if (!target) return null;

  return {
    timeline: {
      ...timeline,
      liveIndex: viewIndex,
      viewIndex,
      actualSecondsById: nextActualSecondsById,
    },
    runtime: { ...runtime, liveActivitySeconds: nextActualSecondsById[target.id] ?? 0 },
  };
};

type RemoveTransitionInput = {
  timeline: TimelineState;
  id: string;
};

type RemoveTransitionOutput = {
  timeline: TimelineState;
  removedWasLive: boolean;
};

export const removeTransition = ({
  timeline,
  id,
}: RemoveTransitionInput): RemoveTransitionOutput | null => {
  const removedIndex = timeline.activities.findIndex((item) => item.id === id);
  if (removedIndex < 0) return null;

  const removedWasLive = removedIndex === timeline.liveIndex;
  const nextActual = { ...timeline.actualSecondsById };
  delete nextActual[id];

  const nextActivities = timeline.activities.filter((item) => item.id !== id);
  const nextLiveIndex =
    timeline.liveIndex > removedIndex
      ? timeline.liveIndex - 1
      : timeline.liveIndex === removedIndex
        ? Math.max(0, Math.min(removedIndex, timeline.activities.length - 2))
        : timeline.liveIndex;

  const nextViewIndex =
    timeline.viewIndex > removedIndex
      ? timeline.viewIndex - 1
      : timeline.viewIndex === removedIndex
        ? Math.max(0, Math.min(removedIndex, timeline.activities.length - 2))
        : timeline.viewIndex;

  return {
    timeline: {
      ...timeline,
      activities: nextActivities,
      liveIndex: nextLiveIndex,
      viewIndex: nextViewIndex,
      actualSecondsById: nextActual,
    },
    removedWasLive,
  };
};

type MoveTransitionInput = {
  timeline: TimelineState;
  index: number;
  direction: number;
};

type MoveTransitionOutput = {
  timeline: TimelineState;
  movedItemId?: string;
  swappedItemId?: string;
};

export const moveTransition = ({
  timeline,
  index,
  direction,
}: MoveTransitionInput): MoveTransitionOutput | null => {
  const target = index + direction;
  if (target < 0 || target >= timeline.activities.length) return null;

  const movedItemId = timeline.activities[index]?.id;
  const swappedItemId = timeline.activities[target]?.id;

  return {
    timeline: {
      ...timeline,
      activities: reorderItems(timeline.activities, index, target),
      liveIndex: reorderCurrentIndex(timeline.liveIndex, index, target),
      viewIndex: reorderCurrentIndex(timeline.viewIndex, index, target),
    },
    movedItemId,
    swappedItemId,
  };
};
