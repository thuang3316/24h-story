import { memo, useState, useRef, useCallback } from "react";
import { getTimeRemaining } from "../../hooks/useStoryExpiry";
import styles from "./StoryBubble.module.css";

const LONG_PRESS_MS = 500;

const StoryBubble = memo(function StoryBubble({ story, onClick, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);
  const longPressTimer = useRef(null);
  const timeLeft = getTimeRemaining(story.createdAt);

  // ── Long-press (mobile) ───────────────────────────────────────────────────
  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setShowDelete(true);
    }, LONG_PRESS_MS);
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback((e) => {
    e.stopPropagation(); // prevent opening the story
    setShowDelete(false);
    onDelete(story.id);
  }, [onDelete, story.id]);

  // Dismiss delete button when clicking elsewhere
  const handleBlur = useCallback(() => {
    setTimeout(() => setShowDelete(false), 150);
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${showDelete ? styles.active : ""}`}
      onMouseEnter={() => story.isUploaded && setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onTouchStart={story.isUploaded ? handleTouchStart : undefined}
      onTouchEnd={story.isUploaded ? handleTouchEnd : undefined}
      onBlur={handleBlur}
    >
      <button
        className={`${styles.bubble} ${story.seen ? styles.seen : styles.unseen}`}
        onClick={onClick}
        aria-label={`View ${story.username}'s story${timeLeft ? `, ${timeLeft} remaining` : ""}`}
      >
        <div className={styles.ring}>
          <div className={styles.avatar} style={{ backgroundColor: story.color }}>
            {story.username[0].toUpperCase()}
          </div>
        </div>
        <span className={styles.label}>{story.username}</span>
        {timeLeft && (
          <span className={styles.expiry}>{timeLeft}</span>
        )}
      </button>

      {/* Delete button — only rendered for uploaded stories */}
      {story.isUploaded && showDelete && (
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          aria-label={`Delete ${story.username}'s story`}
        >
          ✕
        </button>
      )}
    </div>
  );
});

export default StoryBubble;