import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

serve(async (req: Request) => {
    const url = "https://www.youtube.com/@Wanderbraun/videos";
    const initialPhrase = "var ytInitialData = ";
    let request = await fetch(url);
    const requestText = await request.text();
    const tab = "/@Wanderbraun/videos"
    const beginingIndex = requestText.indexOf(initialPhrase);
    const endingIndex = requestText.indexOf('</script>', beginingIndex);
    const sliceJS = requestText.slice(beginingIndex + initialPhrase.length, endingIndex - 1);
    try {
        const jsonResult = JSON.parse(sliceJS);
        const allVideos = jsonResult.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents;
        const mappedVideos = allVideos.filter((x: any) => x.richItemRenderer).map(getVideoIdAndDescription);
        return new Response(JSON.stringify(mappedVideos))
    } catch(e) {
        console.log('error')
        console.log(e)
    }
    return new Response(sliceJS)
});

const getVideoIdAndDescription = (video: any) => {
    const videoId = video.richItemRenderer.content.videoRenderer.videoId;
    const description = video.richItemRenderer.content.videoRenderer.title.runs[0].text;
    return { videoId, description };
}