"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [playlist, setPlaylist] = useState({
    name: "",
    owner: { display_name: "" },
    description: "",
    images: [] as { url: string }[],
  })
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
      if (response.ok) {
        setPlaylist(result);
        console.log("Fetched Playlist:", result);
      } else {
        console.error("Failed to fetch playlist:", result);
      }
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

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
      {playlist.name && (
        <div className={styles.playlist}>
          <Image
            src={playlist.images[0].url}
            alt={playlist.name}
            width={300}
            height={300}
          />
          <h2>{playlist.name}</h2>
          <h3>{playlist.owner.display_name}</h3>
          <p>{playlist.description}</p>
        </div>
      )}
      <a href="https://getsongbpm.com">GetSongBPM</a>
    </div>
  );
}
