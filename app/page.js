"use client"
import Link from "next/link";
import { useEffect, useState } from "react"
import { createWorker } from "tesseract.js"



export default function Home() {
  const worker = createWorker();
const [selectedImage, setSelectedImage]= useState(null)
const [textResult, setTextResult]= useState("")
const [imageLang, setImageLang]= useState("eng")
const [textLang, setTextLang]= useState("eng")


const convertImageToText= async () =>{
  await (await worker).loadLanguage('eng')
  await (await worker).initialize('eng')
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
    {selectedImage &&(
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
