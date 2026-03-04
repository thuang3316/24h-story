import { useEffect, useCallback } from "react";

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Returns a helper to get the remaining time string for a story,
 * and fires onExpire(id) for any story that has passed 24h.
 *
 * Runs a check every 60 seconds. Uses Date.now() so it's accurate
 * even if the tab was backgrounded.
 */
export function useStoryExpiry({ stories, onExpire }) {
  const checkExpiry = useCallback(() => {
    const now = Date.now();
    stories.forEach(story => {
      if (story.createdAt && now - story.createdAt >= EXPIRY_MS) {
        onExpire(story.id);
      }
    });
  }, [stories, onExpire]);

  useEffect(() => {
    checkExpiry(); // run immediately on mount / story change
    const interval = setInterval(checkExpiry, 60_000);
    return () => clearInterval(interval);
  }, [checkExpiry]);
}

export function getTimeRemaining(createdAt) {
  if (!createdAt) return null;
  const remaining = EXPIRY_MS - (Date.now() - createdAt);
  if (remaining <= 0) return "expired";
  const totalMinutes = Math.floor(remaining / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}