import { useEffect, useRef, useCallback } from "react";

const STORY_DURATION = 3000;

export function useStoryTimer({ activeIndex, isPaused, onComplete }) {
  const fillRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const tick = useCallback((timestamp) => {
    if (!startRef.current) startRef.current = timestamp;
    const progress = Math.min((timestamp - startRef.current) / STORY_DURATION, 1); // a number between 0 and 1

    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${progress})`;
    }

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!isPaused) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, isPaused, tick]);

  return fillRef;
}