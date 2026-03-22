import type { Activity } from "../types/schedule";

type CompactActivity = { t: string; d: string; r: string };

const HASH_PREFIX = "schedule=";

const encode = (activities: Activity[]): string => {
  const data: CompactActivity[] = activities.map((a) => ({
    t: a.title,
    d: a.durationValue,
    r: a.responsible,
  }));
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  return btoa(String.fromCharCode(...bytes));
};

const decode = (encoded: string): Activity[] | null => {
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const data: CompactActivity[] = JSON.parse(new TextDecoder().decode(bytes));
    if (!Array.isArray(data)) return null;
    return data.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      title: item.t || "",
      durationValue: item.d || "",
      responsible: item.r || "",
    }));
  } catch {
    return null;
  }
};

export const buildShareUrl = (activities: Activity[]): string => {
  const base = window.location.href.split("#")[0];
  return `${base}#${HASH_PREFIX}${encode(activities)}`;
};

export const parseScheduleFromHash = (): Activity[] | null => {
  const hash = window.location.hash.slice(1);
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return decode(hash.slice(HASH_PREFIX.length));
};
