"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type TrackObject = {
  artists: { name: string }[];
  name: string,
  album: { images: { url: string }[] };
}

export default function Home() {
  const [playlist, setPlaylist] = useState({
    name: "",
    owner: { display_name: "" },
    description: "",
    images: [] as { url: string }[],
    tracks: { items: [] as { track: TrackObject }[] },
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

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const song = playlist.tracks.items[0].track.name;
    const artist = playlist.tracks.items[0].track.artists[0].name;

    try {
      const response = await fetch(`/api/search?song=${song}&artist=${artist}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Fetched Lyrics:", result);
      } else {
        console.error("Failed to fetch lyrics:", result);
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
    }
  }

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
          <div className={styles.playlistInfo}>
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
          <div className={styles.tracks}>
            <ul>
              {playlist.tracks.items.map((item, index) => (
                <li key={index} className={styles.track}>
                  <Image
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    width={50}
                    height={50}
                    className={styles.trackImage}
                  />
                  <span>{item.track.name} by {item.track.artists.map(artist => artist.name).join(", ")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {playlist.tracks.items.length !== 0 && (
        <button className={styles.button} onClick={handleClick}>assign me a painting</button>
      )}
      <a href="https://getsongbpm.com">GetSongBPM</a>
    </div>
  );
}
