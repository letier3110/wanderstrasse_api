interface IYoutubeVideo {
  videoId: string
  description: string
  thumbnail: string
  lengthText: string
}

export const getYoutubeVideos = async (): Promise<string> => {
  const url = 'https://www.youtube.com/@Wanderbraun/videos'
  const initialPhrase = 'var ytInitialData = '
  let request = await fetch(url)
  const requestText = await request.text()
  const tab = '/@Wanderbraun/videos'
  const beginingIndex = requestText.indexOf(initialPhrase)
  const endingIndex = requestText.indexOf('</script>', beginingIndex)
  const sliceJS = requestText.slice(beginingIndex + initialPhrase.length, endingIndex - 1)
  try {
    const jsonResult = JSON.parse(sliceJS)
    const allVideos =
      jsonResult.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents
    const mappedVideos = allVideos.filter((x: any) => x.richItemRenderer).map(getVideoIdAndDescription)
    return JSON.stringify(mappedVideos)
  } catch (e) {
    console.log('error')
    console.log(e)
  }
  return sliceJS
}

const getVideoIdAndDescription = (video: any) => {
  const videoObj = video.richItemRenderer.content.videoRenderer
  const videoId = videoObj.videoId
  const description = videoObj.title.runs[0].text
  const thumbnail = videoObj.thumbnail.thumbnails[0].url
  const lengthText = videoObj.lengthText.simpleText
  return { videoId, description, thumbnail, lengthText }
}
