export const DURATION_PARTIAL_RE = /^\d{0,3}(?::\d{0,2}(?::\d{0,2})?)?$/;
export const DURATION_STRICT_RE = /^(?:\d{1,2}|\d{1,3}:\d{2}|\d{1,2}:\d{2}:\d{2})$/;

export const normalizeDurationInput = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!DURATION_STRICT_RE.test(trimmed)) return null;
  if (/^\d{1,2}$/.test(trimmed)) return `00:${trimmed.padStart(2, "0")}`;
  return trimmed;
};
