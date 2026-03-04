import styles from "./AddButton.module.css";

export default function AddButton({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Add story" className={styles.btn}>
      <div className={styles.circle}>+</div>
      <span className={styles.label}>Add</span>
    </button>
  );
}