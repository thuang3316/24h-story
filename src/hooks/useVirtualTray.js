import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Virtualizes a horizontally scrolling list using IntersectionObserver.
 * Accepts an external containerRef so it can share the same DOM node
 * with other hooks (e.g. useScrollArrows).
 *
 * Returns:
 *  - getItemRef : ref callback factory for each item
 *  - isVisible  : function(index) => boolean
 */
export function useVirtualTray(itemCount, containerRef) {
  const itemRefs = useRef({});
  const [visibleSet, setVisibleSet] = useState(() => new Set());
  const observerRef = useRef(null);

  const getItemRef = useCallback((index) => (node) => {
    if (node) {
      itemRefs.current[index] = node;
      observerRef.current?.observe(node);
    } else {
      if (itemRefs.current[index]) {
        observerRef.current?.unobserve(itemRefs.current[index]);
        delete itemRefs.current[index];
      }
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleSet(prev => {
          const next = new Set(prev);
          entries.forEach(entry => {
            const index = Number(entry.target.dataset.index);
            if (entry.isIntersecting) next.add(index);
            else next.delete(index);
          });
          return next;
        });
      },
      {
        root: containerRef.current,
        rootMargin: "0px 80px 0px 80px",
        threshold: 0,
      }
    );

    Object.values(itemRefs.current).forEach(node => {
      observerRef.current.observe(node);
    });

    return () => observerRef.current?.disconnect();
  }, [itemCount, containerRef]);

  const isVisible = useCallback(
    (index) => visibleSet.has(index),
    [visibleSet]
  );

  return { getItemRef, isVisible };
}