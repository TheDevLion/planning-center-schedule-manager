import { useCallback, useEffect, useState } from "react";

const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const hasNativeFullscreen = (): boolean =>
  typeof document.documentElement.requestFullscreen === "function" ||
  typeof (document.documentElement as any).webkitRequestFullscreen === "function";

const FALLBACK_CLASS = "fullscreen-fallback";

const requestNative = async (): Promise<void> => {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    await el.requestFullscreen();
  } else if ((el as any).webkitRequestFullscreen) {
    (el as any).webkitRequestFullscreen();
  }
};

const exitNative = async (): Promise<void> => {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  }
};

const getNativeFullscreenElement = (): Element | null =>
  document.fullscreenElement ?? (document as any).webkitFullscreenElement ?? null;

export const useFullscreen = (): {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
} => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const syncState = useCallback(() => {
    if (hasNativeFullscreen()) {
      setIsFullscreen(getNativeFullscreenElement() !== null);
    } else {
      setIsFullscreen(document.documentElement.classList.contains(FALLBACK_CLASS));
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", syncState);
    document.addEventListener("webkitfullscreenchange", syncState);
    return () => {
      document.removeEventListener("fullscreenchange", syncState);
      document.removeEventListener("webkitfullscreenchange", syncState);
    };
  }, [syncState]);

  const toggleFullscreen = useCallback(() => {
    if (hasNativeFullscreen()) {
      if (getNativeFullscreenElement()) {
        exitNative();
      } else {
        requestNative();
      }
    } else if (isIOS()) {
      const el = document.documentElement;
      el.classList.toggle(FALLBACK_CLASS);
      setIsFullscreen(el.classList.contains(FALLBACK_CLASS));
      window.scrollTo(0, 0);
    }
  }, []);

  return { isFullscreen, toggleFullscreen };
};
