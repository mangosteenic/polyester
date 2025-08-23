import lyricsSearcher from "lyrics-searcher";

export async function getLyrics(song: string, artist: string): Promise<string | null> {
  try {
    const lyrics = await lyricsSearcher(artist, song);
    return lyrics;
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return null;
  }
}