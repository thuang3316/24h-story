import AddButton from "./AddButton";
import StoryBubble from "./StoryBubble";
import styles from "./StoryTray.module.css";

export default function StoryTray({ stories, onStoryClick, onAddClick, onDelete }) {
  return (
    <div className={styles.tray}>
      <AddButton onClick={onAddClick} />
      {stories.map((story, index) => (
        <StoryBubble
          key={story.id}
          story={story}
          onClick={() => onStoryClick(index)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}