import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <form className={styles.form}>
        <label>playlist link: </label>
        <input
          type="text"
          placeholder="https://example.com/playlist"
          className={styles.input}
          />
        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
}
