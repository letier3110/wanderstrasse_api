let lastIndex = 4449

interface IPost {
  text: string
  image: string
}

let buffer: IPost[] = []

const initialPhrase = `<meta property="og:description" content="`
const endingPhrase = `<meta property="twitter:title"`

const initialImagePhrase = `<meta property="og:image" content="`
const endingImagePhrase = `<meta property="og:site_name" content="Telegram">`

const getInitial = async () => {
  let isValid = await checkIfValid(lastIndex)

  if (isValid) {
    // console.log('valid')
    const extractedText = extractText(isValid)
    const extractedImage = extractImage(isValid)
    // console.log(extractedText)
    // console.log(extractedImage)
    buffer.push({
      text: extractedText,
      image: extractedImage
    })
  } else {
    // console.log('not valid')
    // console.log(isValid)
  }

  while (isValid) {
    lastIndex += 1
    isValid = await checkIfValid(lastIndex)
    if (isValid) {
      // console.log('valid cycle')
      const extractedText = extractText(isValid)
      const extractedImage = extractImage(isValid)
      // console.log(extractedText)
      // console.log(extractedImage)
      buffer.push({
        text: extractedText,
        image: extractedImage
      })
    } else {
      // console.log('not valid cycle')
      // console.log(isValid)
    }
  }
  return JSON.stringify(buffer)
}

const extractText = (text: string) => {
  const beginingIndex = text.indexOf(initialPhrase)
  const almostEndingIndex = text.indexOf(endingPhrase, beginingIndex)
  const endingIndex = text.lastIndexOf('>', almostEndingIndex)
  const sliceJS = text.slice(beginingIndex + initialPhrase.length, endingIndex - 2)
  return sliceJS
}

const extractImage = (text: string) => {
  const beginingIndex = text.indexOf(initialImagePhrase)
  const almostEndingIndex = text.indexOf(endingImagePhrase, beginingIndex)
  const endingIndex = text.lastIndexOf('>', almostEndingIndex)
  const sliceJS = text.slice(beginingIndex + initialImagePhrase.length, endingIndex - 1)
  return sliceJS
}

const checkIfValid = async (id: number) => {
  const url = `https://t.me/wanderstrasse/${id}`
  const errorPhrase = `If you have <strong>Telegram</strong>, you can view post <br>and join <strong dir="auto">`
  const request = await fetch(url)
  const requestText = await request.text()
  const errorIndex = requestText.indexOf(errorPhrase)
  if (errorIndex >= 0) {
    return null
  }
  return requestText
}

export const getTgPosts = async (): Promise<string> => {
  const text = await getInitial()
  return text
}
