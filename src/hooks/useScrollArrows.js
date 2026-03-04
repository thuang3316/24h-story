import { useEffect, useRef, useState, useCallback } from "react";

const SCROLL_AMOUNT = 200; // px per arrow click

/**
 * Tracks scroll position of a container to determine when
 * left/right arrows and fade edges should be visible.
 *
 * Returns:
 *  - containerRef   : attach to the scrollable element
 *  - canScrollLeft  : boolean — show left arrow/fade
 *  - canScrollRight : boolean — show right arrow/fade
 *  - scrollLeft     : scroll the container left by SCROLL_AMOUNT
 *  - scrollRight    : scroll the container right by SCROLL_AMOUNT
 */
export function useScrollArrows() {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    update(); // check on mount

    el.addEventListener("scroll", update, { passive: true });
    // Also re-check when the container resizes (e.g. window resize)
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const scrollLeft = useCallback(() => {
    containerRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    containerRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  }, []);

  return { containerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight };
}