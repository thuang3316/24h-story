import { memo, useCallback } from "react";
import AddButton from "./AddButton";
import StoryBubble from "./StoryBubble";
import { useVirtualTray } from "../../hooks/useVirtualTray";
import { useScrollArrows } from "../../hooks/useScrollArrows";
import styles from "./StoryTray.module.css";

const BubblePlaceholder = memo(function BubblePlaceholder() {
  return <div className={styles.placeholder} aria-hidden="true" />;
});

export default function StoryTray({ stories, onStoryClick, onAddClick, onDelete }) {
  // useVirtualTray and useScrollArrows both need a ref to the scroll container.
  // We merge them by passing the containerRef from useScrollArrows into useVirtualTray.
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  } = useScrollArrows();

  const { getItemRef, isVisible } = useVirtualTray(stories.length, containerRef);

  return (
    <div className={styles.outer}>
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>
      )}

      {/* Left fade */}
      {canScrollLeft && <div className={`${styles.fade} ${styles.fadeLeft}`} />}

      {/* Scrollable tray */}
      <div className={styles.tray} ref={containerRef}>
        <AddButton onClick={onAddClick} />
        {stories.map((story, index) => (
          <div
            key={story.id}
            className={styles.itemWrapper}
            ref={getItemRef(index)}
            data-index={index}
          >
            {isVisible(index) ? (
              <StoryBubble
                story={story}
                onClick={() => onStoryClick(index)}
                onDelete={onDelete}
              />
            ) : (
              <BubblePlaceholder />
            )}
          </div>
        ))}
      </div>

      {/* Right fade */}
      {canScrollRight && <div className={`${styles.fade} ${styles.fadeRight}`} />}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          ›
        </button>
      )}
    </div>
  );
}