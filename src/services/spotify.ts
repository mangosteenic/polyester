import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

let accessToken: string | null = null;

export async function getAccessToken() {
    if (accessToken) return accessToken;
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Error fetching access token: ${data.error}`);
    }

    accessToken = data.access_token;

    if (!accessToken) {
        throw new Error('Failed to retrieve access token');
    }

    setTimeout(() => {
        accessToken = null; // Reset access token after it expires
    }, data.expires_in * 1000);

    return data.access_token;
}

export async function getPlaylist(playlistId: string) {
    const token = await getAccessToken();
    spotifyApi.setAccessToken(token);

    try {
        const data = await spotifyApi.getPlaylist(playlistId);
        return data.body;
    } catch (error) {
        console.error('Error fetching playlist:', error);
        throw error;
    }
}