import { getTranslation } from "../i18n/i18nStore";
import type { ScheduleParseResponse } from "../types/schedule";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:51278";

export const parseScheduleFile = async (file: File): Promise<ScheduleParseResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/file-parse/planning-center-service`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { detail?: string };
    throw new Error(payload.detail || getTranslation().errors.ocrFailed);
  }

  return (await response.json()) as ScheduleParseResponse;
};
