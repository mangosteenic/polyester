import { getLyrics } from "@/services/genius";

export async function GET(
  request: Request,
) {
  const { searchParams } = new URL(request.url);
  const song = searchParams.get("song");
  const artist = searchParams.get("artist");

  if (!song || !artist) {
    return new Response(JSON.stringify({ error: "Missing song or artist parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const result = await getLyrics(song, artist);

  return new Response(JSON.stringify({result}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}