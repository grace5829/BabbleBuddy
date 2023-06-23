"use client"

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
// import { Deepgram } from "@deepgram/sdk/browser";

const page = () => {
  // const deepgram = new Deepgram(process.env.NEXT_PUBLIC_SPEECH_TO_TEXT_KEY);

const [recorder, setRecorder]=useState()
const [streamStore, setStreamStore]=useState()
let mediaRecorder
useEffect(() => {

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
     mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
    });
    // mediaRecorder.active=false
    // stream.active=false
    console.log(stream)
    // console.log(mediaRecorder)

    const socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
      "token",
      process.env.NEXT_PUBLIC_SPEECH_TO_TEXT_KEY,
    ]);

//send recording to deepgram
    socket.onopen= ()=>{
      mediaRecorder.addEventListener("dataavailable",event => {
        socket.send(event.data)
      }) 
      mediaRecorder.start(250)
    }

    // getting transcript back
    socket.onmessage = (message)=>{
      const received = JSON.parse(message.data)
      const transcript=received.channel.alternatives[0].transcript
      console.log(transcript)
    }
});
}, [])

const test=()=>{
console.log(mediaRecorder)
mediaRecorder.state=false
}


  return (
    <div>
        <Link href="/">Home</Link>
        <Link href="/image"  className="mx-1.5">Upload Image</Link>
      <div onClick={test}> Push</div>
    </div>
  )
}

export default page