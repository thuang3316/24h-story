import { useState, useCallback } from "react";
import StoryTray from "./components/StoryTray";
import StoryViewer from "./components/StoryViewer";
import AddStoryModal from "./components/AddStoryModal";
import { generateMockStories } from "./data/mockStories";
import { useStoryExpiry } from "./hooks/useStoryExpiry";
import "./App.css";

const STORAGE_KEY = "stories_user_uploads";

function loadStoredStories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoriesToStorage(uploadedStories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedStories));
  } catch (e) {
    console.warn("localStorage save failed (possibly too large):", e);
  }
}

export default function App() {
  const [stories, setStories] = useState(() => [
    ...generateMockStories(),
    ...loadStoredStories(),
  ]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // expiry
  const removeStory = useCallback((id) => {
    setStories(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveStoriesToStorage(updated.filter(s => s.isUploaded));
      return updated;
    });
  }, []);

  useStoryExpiry({ stories, onExpire: removeStory });

  // delete
  const handleDelete = useCallback((id) => {
    removeStory(id);
    setStories(prev => {
      if (viewerOpen && prev[activeIndex]?.id === id) {
        setViewerOpen(false);
      }
      return prev;
    });
  }, [removeStory, viewerOpen, activeIndex]);

  // add story
  const handleModalSubmit = useCallback(({ username, color, imageBase64 }) => {
    const newStory = {
      id: Date.now(),
      username,
      color,
      img: imageBase64,
      seen: false,
      isUploaded: true,
      createdAt: Date.now(),
    };
    setStories(prev => {
      const updated = [...prev, newStory];
      saveStoriesToStorage(updated.filter(s => s.isUploaded));
      return updated;
    });
    setModalOpen(false);
  }, []);

  // viewer control
  const openStory = useCallback((index) => {
    setActiveIndex(index);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => setViewerOpen(false), []);

  const markSeen = useCallback((index) => {
    setStories(prev =>
      prev.map((s, i) => i === index ? { ...s, seen: true } : s)
    );
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex(prev => {
      const next = prev + 1;
      if (next >= stories.length) { setViewerOpen(false); return 0; }
      return next;
    });
  }, [stories.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <div className="app">
      <div className="app-inner">
        <h2 className="app-title">Stories</h2>
        <StoryTray
          stories={stories}
          onStoryClick={openStory}
          onAddClick={() => setModalOpen(true)}
          onDelete={handleDelete}
        />
      </div>

      {modalOpen && (
        <AddStoryModal
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}

      {viewerOpen && (
        <StoryViewer
          stories={stories}
          activeIndex={activeIndex}
          onClose={closeViewer}
          onNext={goNext}
          onPrev={goPrev}
          onSeen={markSeen}
        />
      )}
    </div>
  );
}