"use client";

import Link from "next/link";
import { useEffect, useState, createContext} from "react";
import ImageToText from "./ImageToText";
import { languages } from "./languages";
// import text.png from "./text.png"

//create api backend route to translate the lanagues?
export const LanguageContext=createContext()

export default function ImagePage() {
    
  const axios = require("axios").default;
  const { v4: uuidv4 } = require("uuid");
  const [textResult, setTextResult] = useState("");
  const [textResultOriginal, setTextResultOriginal] = useState("");
  const [textInputLang, setTextInputLang] = useState("");
  const [textOutputLang, setTextOutputLang] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const languagesKeys = Object.keys(languages);

  const convertImageTextToSelectedLang = () => {
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
          text: textResultOriginal,
        },
      ],
      responseType: "json",
    }).then(function (response) {
        console.log(response.data[0].translations[0].text)
      setTextResult(response.data[0].translations[0].text);
    });
  };

  const handleTextLangChange = (evt) => {
    let selectedLang = evt.target.value;
    setTextOutputLang(languages[selectedLang].text);
  };

  useEffect(() => {
    convertImageTextToSelectedLang();
  }, [textOutputLang, selectedImage, textInputLang]);

  return (
    <LanguageContext.Provider value={[selectedImage,setSelectedImage, setTextResultOriginal, setTextInputLang]} >

    <main>
      <Link href="/">Home</Link>
      <Link href="/speech"  className="mx-1.5">Speech</Link>

      <h1> Babble Buddy</h1>
      <h3 className="">Image to text!</h3>
      <div className="">
        <ImageToText/>

        <div className="border-2 border-black">
          <label htmlFor="text-languages" className="border-2  py-px">
            Text Language:
          </label>

          <select
            name="text-languages"
            id="text-languages"
            className="border-2 py-px"
            onChange={handleTextLangChange}
          >
            {languagesKeys.map((language) => (
              <option value={language} key={language}>
                {language}
              </option>
            ))}
          </select>

          {textResult ? (
            <div>
              {textResult}
            </div>
          ) : selectedImage? (<p>Select language</p>):
          
           (
              <p>Upload image with text</p>
          )}
        </div>
      </div>
    </main>
    </LanguageContext.Provider>

  );
}