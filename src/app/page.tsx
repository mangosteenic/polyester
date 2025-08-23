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

  const [imageUrls, setImageUrls] = useState<string[]>([]);

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
    const title = playlist.name.replaceAll(/[0-9]/g, '').trim();

    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${title}&fields=image_id&query[match][artwork_type_title]=Painting&limit=5`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      const imageIDs = result.data.map((artwork: { image_id: number }) => artwork.image_id);
      const imageUrls = imageIDs.map((image_id: number) => `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`);
      setImageUrls(imageUrls);

      if (response.ok) {
        console.log("Search Result:", result);
      } else {
        console.error("Failed to search:", result);
      }
    } catch (error) {
      console.error("Error during search:", error);
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
        <button className={styles.button} onClick={handleClick}>suggest paintings</button>
      )}
      {imageUrls.length > 0 && (
        <div className={styles.suggestions}>
          <div className={styles.imageGrid}>
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Suggested artwork ${index + 1}`}
                width={200}
                height={200}
                className={styles.suggestedImage}
              />
            ))}
          </div>
        </div>
      ) }
      <a href="https://getsongbpm.com">GetSongBPM</a>
    </div>
  );
}
