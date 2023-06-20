"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import { languages } from "./languages";
// import text.png from "./text.png"
import IMAGE_TO_TEXT_KEY from "./.env.local"
import IMAGE_TO_TEXT_ENDPOINT from "./.env.local"
import IMAGE_TO_TEXT_LOCATION from "./.env.local"

//create api backend route to translate the lanagues? 

export default function Home() {
  const worker = createWorker();
  const axios = require("axios").default;
  const { v4: uuidv4 } = require("uuid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("Upload image with text");
  const [textTranslated, setTextTranslated] = useState("");
  const [imageLang, setImageLang] = useState("eng");
  const [textLang, setTextLang] = useState("en");

  const TextTranslationClient =
    require("@azure-rest/ai-translation-text").default;




  let imageLangOptions = document.getElementById("image-languages");

  // console.log(imageLangOptions);
  // let selectedImageLang=imageLangOptions.options[imageLangOptions.selectedIndex].text;

  
  const convertImageTextToSelectedLang = () =>{
    
    axios({
      baseURL: IMAGE_TO_TEXT_ENDPOINT,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": IMAGE_TO_TEXT_KEY,
        // location required if you're using a multi-service or regional (not global) resource.
        "Ocp-Apim-Subscription-Region": IMAGE_TO_TEXT_LOCATION,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: "en",
        to: ["sw", "it"],
      },
      data: [
        {
          text: "Hello, friend! What did you do today?",
        },
      ],
      responseType: "json",
    }).then(function (response) {
      console.log(JSON.stringify(response.data, null, 4));
    });
 }
  //image to text api; only works for same language image to same language text
  const languagesKeys = Object.keys(languages);
  const convertImageToText = async () => {
    await (await worker).loadLanguage(imageLang);
    await (await worker).initialize(imageLang);
    const { data } = await (await worker).recognize(selectedImage);
    setTextResult(data.text);
    await (await worker).terminate();
  };

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, imageLang]);

  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };


  const handleImageLangChange= (evt) =>{
    console.log(evt.target.value)
    let selectedLang=evt.target.value
    setImageLang(languages[selectedLang].image)
    // console.log(languages[selectedLang].image)
  }

  // console.log(imageLang)
  return (
    <main>
      <Link href="/speech">Speech</Link>
      <h1> Babble Buddy</h1>
      <h3 className="">Text to image!</h3>
      <div className="">
        <label >Upload Image</label>
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleChangeImage}
        />
      </div>
                      {/* try onChange */}
      <label htmlFor="image-languages">Image Language:</label>
      <select name="image-languages" id="image-languages" onChange={handleImageLangChange}>
        {languagesKeys.map((language) => (
          <option value={language} key={language} >
            {language}
          </option>
        ))}
      </select>

      <div>
        {selectedImage == null ? (
          <div>
   <p> Upload Image with text</p>
          </div>
        ) : (
          <div>
            <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
          </div>
        )}

        <div className="border-2 border-black">
          <label htmlFor="text-languages" className="border-2  py-px">Text Language:</label>

          <select name="text-languages" id="text-languages" className="border-2 py-px">
            {languagesKeys.map((language) => (
              <option value={language} key={language}>
                {language}
              </option>
            ))}
          </select>

          {textResult ? (
            <div>
              <p>{textResult}</p>
            </div>
          ) :             <div>
              <p>Upload image with text</p>
            </div>}

        </div>
      </div>
    </main>
  );
}
