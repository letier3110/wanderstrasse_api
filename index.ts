import { serve } from 'https://deno.land/std@0.155.0/http/server.ts'
import { getTgPosts } from "./tg.ts";
import { getYoutubeVideos } from "./youtube.ts";

serve(async (req: Request) => {
  const youtubeVideos = JSON.parse(await getYoutubeVideos());
  const tgPosts = JSON.parse(await getTgPosts());
  return new Response(JSON.stringify({ youtubeVideos, tgPosts }))
})