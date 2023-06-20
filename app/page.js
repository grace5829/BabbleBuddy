"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import { languages } from "./languages";
// import text.png from "./text.png"


//create api backend route to translate the lanagues? 

export default function Home() {
  const worker = createWorker();
  const axios = require("axios").default;
  const { v4: uuidv4 } = require("uuid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("Upload image with text");
  const [textTranslated, setTextTranslated] = useState("");
  const [imageLang, setImageLang] = useState("eng");
  const [textLang, setTextLang] = useState("eng");
  const [textInputLang, setTextInputLang] = useState("en");
  const [textOutputLang, setTextOutputLang] = useState("en");

  const TextTranslationClient =
    require("@azure-rest/ai-translation-text").default;

  
  const convertImageTextToSelectedLang = () =>{
    
    axios({
      baseURL: `${process.env.NEXT_PUBLIC_IMAGE_TO_TEXT_ENDPOINT}`,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": `${process.env.NEXT_PUBLIC_IMAGE_TO_TEXT_KEY}`,
        // location required if you're using a multi-service or regional (not global) resource.
        "Ocp-Apim-Subscription-Region": `${process.env.NEXT_PUBLIC_IMAGE_TO_TEXT_LOCATION}`,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: textInputLang,
        to: [textOutputLang],
      },
      data: [
        {
          text: textResult,
        },
      ],
      responseType: "json",
    }).then(function (response) {
      console.log(JSON.stringify(response.data, null, 4));
    });
 }

 convertImageTextToSelectedLang()
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
    let selectedLang=evt.target.value
    setImageLang(languages[selectedLang].image)
setTextInputLang(languages[selectedLang].text)
  }
  const handleTextLangChange= (evt) =>{
    let selectedLang=evt.target.value
    setTextOutputLang(languages[selectedLang].text)

  }
  useEffect(() => {
    
  convertImageTextToSelectedLang()

  }, [setTextOutputLang])
  
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

          <select name="text-languages" id="text-languages" className="border-2 py-px" onChange={handleTextLangChange}>
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
