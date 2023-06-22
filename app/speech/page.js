"use client"

import Link from 'next/link'
import React, { useState } from 'react'
// import { Deepgram } from "@deepgram/sdk/browser";

const page = () => {
  const deepgram = new Deepgram(process.env.NEXT_PUBLIC_SPEECH_TO_TEXT_KEY);

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
    });
const socket = new

    // const deepgramSocket = deepgram.transcription.live({
    //     punctuate: true,
    // });
    // deepgramSocket.addEventListener("open", () => {
    //     mediaRecorder.addEventListener("dataavailable", async (event) => {
    //         if (event.data.size > 0 && deepgramSocket.readyState == 1) {
    //             deepgramSocket.send(event.data);
    //         }
    //     });
    //     mediaRecorder.start(1000);
    // });
    // deepgramSocket.addEventListener("message", (message) => {
    //     const received = JSON.parse(message.data);
    //     const transcript = received.channel.alternatives[0].transcript;
    //     if (transcript && received.is_final) {
    //         console.log(transcript);
    //     }
    // });
});



  return (
    <div>
        <Link href="/">Home</Link>
        <Link href="/image"  className="mx-1.5">Upload Image</Link>
    
    </div>
  )
}

export default page