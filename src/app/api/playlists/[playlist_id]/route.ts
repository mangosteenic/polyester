import { getAccessToken, getPlaylist } from "@/services/spotify"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playlist_id: string }> }
) {
  const { playlist_id } = await params

  const result = await getPlaylist(playlist_id);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

