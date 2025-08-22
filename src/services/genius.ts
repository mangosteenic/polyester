import Genius from "genius-lyrics";

const Client = new Genius.Client(process.env.GENIUS_CLIENT_SECRET);

export async function getLyrics(songTitle: string, artistName: string) {
    try {
        const searches = await Client.songs.search(`${songTitle} ${artistName}`);
        if (searches.length === 0) {
            throw new Error('No results found on Genius');
        }
        const lyrics = await searches[0].lyrics();
        return lyrics;
    } catch (error) {
        console.error('Error searching Genius:', error);
        throw error;
    }
}

