"use client"
import Link from "next/link";
import { useEffect, useState } from "react"
import { createWorker } from "tesseract.js"


export default function Home() {
  const worker = createWorker();
  const [selectedImage, setSelectedImage]= useState(null)
  const [textResult, setTextResult]= useState("")
  const [textTranslated, setTextTranslated]= useState("")
  const [imageLang, setImageLang]= useState("eng")
  const [textLang, setTextLang]= useState("fin")
  
  const TextTranslationClient = require("@azure-rest/ai-translation-text").default

  const key = "0ea6074b21c449acb583bb9efdc84d05";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  const location = "eastus";

  const axios = require('axios').default;
  const { v4: uuidv4 } = require('uuid');


axios({
  baseURL: endpoint,
  url: '/translate',
  method: 'post',
  headers: {
      'Ocp-Apim-Subscription-Key': key,
       // location required if you're using a multi-service or regional (not global) resource.
      'Ocp-Apim-Subscription-Region': location,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4().toString()
  },
  params: {
      'api-version': '3.0',
      'from': 'en',
      'to': ['sw', 'it']
  },
  data: [{
      'text': 'Hello, friend! What did you do today?'
  }],
  responseType: 'json'
}).then(function(response){
  console.log(JSON.stringify(response.data, null, 4));
})


const convertImageToText= async () =>{
  // await (await worker).loadLanguage('eng')
  await (await worker).loadLanguage('kor')
  await (await worker).initialize('kor')
  // await (await worker).initialize('eng')
const {data} = await (await worker).recognize(selectedImage)
console.log(data.text)
setTextResult(data.text)
 await (await worker).terminate()
// await worker.loadLanguage('eng');
// await worker.initialize('eng');
// const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
// console.log(text);
// await worker.terminate();
}



useEffect(()=>{
convertImageToText()
}, [selectedImage])

const lng= navigator.language


const handleChangeImage = (e) =>{
 setSelectedImage(e.target.files[0])
}
  return (
    <main>
    <Link href="/speech">Speech</Link>
    <h1> Babble Buddy</h1>
    <h3>Text to image!</h3>
    <div> 
    <label>Upload Image</label>
    <input type="file" id="upload" accept="image/*" onChange={handleChangeImage}/>
    </div>
    <div>
    {selectedImage && (
      <div> 
      <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
      </div>
      )} 
      {textResult && (
        <div>
          <p>{textResult}</p>
        </div>
      )}
      </div>
    </main>
  )
}

