"use client";

import styles from "./page.module.css";

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const playlistLink = formData.get("playlistLink") as string;
  console.log("Playlist Link:", playlistLink);
  const playlistID = playlistLink.match(/playlist\/([\w\d]+)/)?.[1];

  try {
    const response = await fetch(`/api/playlists/${playlistID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
  } catch (error) {
    console.error("Error fetching playlist:", error);
  }
};

export default function Home() {
  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>playlist link:</label>
        <input
          type="text"
          placeholder="https://example.com/playlist"
          className={styles.input}
          name="playlistLink"
          required
          />
        <button type="submit" className={styles.button}>submit</button>
      </form>
      <a href="https://getsongbpm.com">GetSongBPM</a>
    </div>
  );
}
