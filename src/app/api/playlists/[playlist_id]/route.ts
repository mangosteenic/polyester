import { getAccessToken, getPlaylist } from "@/services/spotify"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playlist_id: string }> }
) {
  const { playlist_id } =  await params

  try {
    const result = await getPlaylist(playlist_id);
    if (!result) {
      return new Response("Playlist not found", { status: 404 });
    }
    
    return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

