import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

let lastIndex = 4449;

const getInitial = async () => {
    let isValid = await checkIfValid(lastIndex);
    const initialPhrase = `<meta property="og:description" content="`;
    const endingPhrase = `<meta property="twitter:title"`;
    
    let requestText = '';

    // if(isValid) {
    //   lastIndex++;
    // }

    let counter = 0;

    while(!isValid) {
        console.log('lastIndex', lastIndex);
        lastIndex--;
        isValid = await checkIfValid(lastIndex);
        counter++;
        if(counter > 5) return 'error';
    }
    requestText = isValid;

    // if(!isValid) {
    //     lastIndex--;
    // } else {
    //     requestText = isValid;
    // }
    const beginingIndex = requestText.indexOf(initialPhrase);
    const almostEndingIndex = requestText.indexOf(endingPhrase, beginingIndex);
    const endingIndex = requestText.lastIndexOf('>', almostEndingIndex);
    const sliceJS = requestText.slice(beginingIndex + initialPhrase.length, endingIndex - 2);
    return sliceJS;
}

const checkIfValid = async (id: number) => {
    const url = `https://t.me/wanderstrasse/${id}`;
    const errorPhrase = `If you have <strong>Telegram</strong>, you can view post <br>and join <strong dir="auto">`;
    let request = await fetch(url);
    const requestText = await request.text();
    const errorIndex = requestText.indexOf(errorPhrase);
    if(errorIndex >= 0) {
        return null;
    }
    return requestText;
}

serve(async (req: Request) => {
    const text = await getInitial();
    return new Response(text);
});