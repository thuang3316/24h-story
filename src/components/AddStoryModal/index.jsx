import { useState, useRef, useCallback } from "react";
import styles from "./AddStoryModal.module.css";

const PRESET_COLORS = [
  "#FF6B6B", "#FF9F43", "#FFE66D", "#A8E6CF",
  "#4ECDC4", "#45B7D1", "#6C63FF", "#C3A6FF",
  "#F78FB3", "#778CA3",
];

function randomColor() {
  return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function AddStoryModal({ onSubmit, onClose }) {
  const [username, setUsername] = useState("");
  const [color, setColor] = useState(randomColor());
  const [imageBase64, setImageBase64] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setError("");
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = () => {
    if (!username.trim()) { setError("Please enter a username."); return; }
    if (!imageBase64)     { setError("Please upload an image."); return; }
    onSubmit({ username: username.trim(), color, imageBase64 });
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Add Your Story</h3>

        <div className={styles.body}>
          {/* ── Left: Form ── */}
          <div className={styles.form}>

            {/* Image upload */}
            <label className={styles.fieldLabel}>Image</label>
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${imageBase64 ? styles.hasImage : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imageBase64 ? (
                <img src={imageBase64} alt="preview" className={styles.dropzoneImg} />
              ) : (
                <div className={styles.dropzoneHint}>
                  <span className={styles.dropzoneIcon}>↑</span>
                  <span>Click or drag & drop an image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Username */}
            <label className={styles.fieldLabel}>Username</label>
            <input
              className={styles.textInput}
              type="text"
              placeholder="e.g. alice"
              maxLength={20}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            {/* Avatar color */}
            <label className={styles.fieldLabel}>Avatar Color</label>
            <div className={styles.colorRow}>
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  className={`${styles.colorSwatch} ${color === c ? styles.colorSelected : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
              <button className={styles.randomBtn} onClick={() => setColor(randomColor())}>
                🎲
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </div>

          {/* ── Right: Live Preview ── */}
          <div className={styles.preview}>
            <p className={styles.previewLabel}>Preview</p>

            {/* Bubble preview */}
            <div className={styles.previewBubble}>
              <div className={styles.previewRing}>
                <div className={styles.previewAvatar} style={{ backgroundColor: color }}>
                  {username ? username[0].toUpperCase() : "?"}
                </div>
              </div>
              <span className={styles.previewUsername}>{username || "username"}</span>
            </div>

            {/* Story card mini preview */}
            <div className={styles.previewCard}>
              {imageBase64 ? (
                <img src={imageBase64} alt="story preview" className={styles.previewCardImg} />
              ) : (
                <div className={styles.previewCardEmpty}>No image yet</div>
              )}
              {/* Mini progress bar */}
              <div className={styles.previewProgressBar}>
                <div className={styles.previewProgressFill} />
              </div>
              <div className={styles.previewCardUser}>
                <div className={styles.previewCardAvatar} style={{ backgroundColor: color }}>
                  {username ? username[0].toUpperCase() : "?"}
                </div>
                <span>{username || "username"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit}>Add Story</button>
        </div>
      </div>
    </div>
  );
}