import { useCallback, useEffect, useRef } from "react";
import { driver } from "driver.js";

import { useTranslation } from "../i18n/i18nStore";

const TOUR_STORAGE_KEY = "pcsm-basic-tour-completed-v1";
const TOUR_START_DELAY_MS = 350;

export const useGuidedTour = (): {
  startTour: () => void;
  startTourIfFirstVisit: () => void;
} => {
  const t = useTranslation();
  const tourRef = useRef<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback(() => {
    if (typeof window === "undefined") return;

    tourRef.current?.destroy();

    const tour = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      nextBtnText: t.tour.next,
      prevBtnText: t.tour.previous,
      doneBtnText: t.tour.done,
      steps: [
        {
          element: "#app-header",
          popover: {
            title: t.tour.steps.welcomeTitle,
            description: t.tour.steps.welcomeDescription,
          },
        },
        {
          element: "#import-button",
          popover: {
            title: t.tour.steps.importTitle,
            description: t.tour.steps.importDescription,
          },
        },
        {
          element: "#edit-button",
          popover: {
            title: t.tour.steps.editTitle,
            description: t.tour.steps.editDescription,
          },
        },
        {
          element: "#live-toggle-button",
          popover: {
            title: t.tour.steps.liveTitle,
            description: t.tour.steps.liveDescription,
          },
        },
        {
          element: "#focused-list",
          popover: {
            title: t.tour.steps.focusTitle,
            description: t.tour.steps.focusDescription,
          },
        },
      ],
    });

    tourRef.current = tour;
    tour.drive();
    window.localStorage.setItem(TOUR_STORAGE_KEY, "1");
  }, [t]);

  const startTourIfFirstVisit = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(TOUR_STORAGE_KEY) === "1") return;

    window.setTimeout(() => {
      startTour();
    }, TOUR_START_DELAY_MS);
  }, [startTour]);

  useEffect(() => {
    return () => {
      tourRef.current?.destroy();
    };
  }, []);

  return { startTour, startTourIfFirstVisit };
};
