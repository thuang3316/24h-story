import styles from "./ProgressBars.module.css";

export default function ProgressBars({ total, activeIndex, fillRef }) {
  return (
    <div className={styles.bars}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={`${activeIndex}-${i}`} className={styles.bar}>
          <div
            className={styles.fill}
            ref={i === activeIndex ? fillRef : null}
            style={{ transform: i < activeIndex ? "scaleX(1)" : "scaleX(0)" }}
          />
        </div>
      ))}
    </div>
  );
}