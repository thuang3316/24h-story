import { useState, useEffect, useRef } from "react";
import { useStoryTimer } from "./useStoryTimer";
import ProgressBars from "./ProgressBars";
import styles from "./StoryViewer.module.css";

export default function StoryViewer({
  stories, activeIndex, onClose, onNext, onPrev, onSeen
}) {
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const viewerRef = useRef(null);
  const story = stories[activeIndex];

  useEffect(() => { onSeen(activeIndex); }, [activeIndex, onSeen]);

  const fillRef = useStoryTimer({ activeIndex, isPaused, onComplete: onNext });

  // touchEvent
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) dx < 0 ? onNext() : onPrev();
      touchStartX.current = null;
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onNext, onPrev]); 

  return (
    <div className={styles.overlay}>
      <div
        ref={viewerRef}
        className={styles.viewer}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
      >
        <ProgressBars total={stories.length} activeIndex={activeIndex} fillRef={fillRef} />

        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.userInfo}>
          <div className={styles.avatar} style={{ backgroundColor: story.color }}>
            {story.username[0].toUpperCase()}
          </div>
          <span className={styles.username}>{story.username}</span>
        </div>

        <img className={styles.media} src={story.img} alt={`${story.username}'s story`} />

        <div className={styles.tapLeft}  onClick={onPrev} />
        <div className={styles.tapRight} onClick={onNext} />
      </div>
    </div>
  );
}