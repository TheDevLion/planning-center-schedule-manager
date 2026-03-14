export const en = {
  app: {
    title: "Planning Center Schedule Manager",
    subtitle: "Control the event sequence in real time.",
  },
  live: {
    activity: "Live activity",
    responsible: "Responsible",
    overallTimer: "Overall timer",
    unassigned: "Unassigned",
  },
  controls: {
    start: "Start",
    pause: "Pause",
    conclude: "Conclude",
    viewPrevious: "View previous",
    viewNext: "View next",
    backToLive: "Back to live",
    reopenAsLive: "Reopen as live",
    import: "Import",
    importFile: "Import schedule file",
    editSchedule: "Edit schedule",
  },
  edit: {
    title: "Edit schedule",
    addActivity: "Add activity",
    close: "Close edit schedule",
    activityName: "Activity name",
    responsible: "Responsible",
    durationPlaceholder: "ss, mm:ss or hh:mm:ss",
    durationValidation: "Use ss, mm:ss or hh:mm:ss",
    moveUp: "Move activity up",
    moveDown: "Move activity down",
    remove: "Remove activity",
  },
  focus: {
    live: "LIVE",
    view: "VIEW",
    actual: "Actual",
    noActivities: "No activities loaded.",
  },
  errors: {
    ocrFailed: "Failed to process OCR",
  },
};

export type Translations = typeof en;
