"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import { languages } from "./languages";
// import text.png from "./text.png"

export default function Home() {
  const worker = createWorker();
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("Upload image");
  const [textTranslated, setTextTranslated] = useState("Upload image");
  const [imageLang, setImageLang] = useState("eng");
  const [textLang, setTextLang] = useState("en");

  const TextTranslationClient =
    require("@azure-rest/ai-translation-text").default;

  const key = "0ea6074b21c449acb583bb9efdc84d05";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  const location = "eastus";

  const axios = require("axios").default;
  const { v4: uuidv4 } = require("uuid");

  let imageLangOptions = document.getElementById("image-languages");
  console.log(imageLangOptions);
  // let selectedImageLang=imageLangOptions.options[imageLangOptions.selectedIndex].text;

  axios({
    baseURL: endpoint,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      // location required if you're using a multi-service or regional (not global) resource.
      "Ocp-Apim-Subscription-Region": location,
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

  const languagesKeys = Object.keys(languages);
  const convertImageToText = async () => {
    await (await worker).loadLanguage("eng");
    await (await worker).initialize("eng");
    const { data } = await (await worker).recognize(selectedImage);
    console.log(data.text);
    setTextResult(data.text);
    await (await worker).terminate();
    // await worker.loadLanguage('eng');
    // await worker.initialize('eng');
    // const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    // console.log(text);
    // await worker.terminate();
  };

  useEffect(() => {
    convertImageToText();
  }, [selectedImage]);

  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  return (
    <main>
      <Link href="/speech">Speech</Link>
      <h1> Babble Buddy</h1>
      <h3>Text to image!</h3>
      <div>
        <label>Upload Image</label>
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleChangeImage}
        />
      </div>

      <label htmlFor="image-languages">Image Language:</label>
      <select name="image-languages" id="image-languages">
        {languagesKeys.map((language) => (
          <option value={language} key={language}>
            {language}
          </option>
        ))}
      </select>

      <div>
        {selectedImage == null ? (
          <div>
            <img
              src={
                "https://www.lifewire.com/thmb/tHjH9M19MsA9gFY-qcZvKYv5oG4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cloud-upload-a30f385a928e44e199a62210d578375a.jpg"
              }
              alt="thumb"
            />
          </div>
        ) : (
          <div>
            <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
          </div>
        )}

        <div className=" border-gray ">
          <label htmlFor="text-languages">Image Language:</label>
          <select name="text-languages" id="text-languages">
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
          ) : null}
        </div>
      </div>
    </main>
  );
}
