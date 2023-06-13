"use client"
import { useState } from "react"

export default function Home() {
const [selectedImage, setSelectedImage]= useState(null)
const [textResult, setTextResult]= useState("")

const handleChangeImage = (e) =>{
 setSelectedImage(e.target.files[0])
}
  return (
    <main>
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
          <p>textResult</p>
        </div>
      )}
      </div>
    </main>
  )
}
