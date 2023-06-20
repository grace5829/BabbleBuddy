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
  const [textResult, setTextResult] = useState("Upload image with text");
  const [textResultOriginal, setTextResultOriginal] = useState("");
  const [textInputLang, setTextInputLang] = useState("en");
  const [textOutputLang, setTextOutputLang] = useState("en");
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
      setTextResult(response.data[0].translations[0].text);
    });
  };


  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };



  const handleTextLangChange = (evt) => {
    let selectedLang = evt.target.value;
    setTextOutputLang(languages[selectedLang].text);
  };

  useEffect(() => {
    convertImageTextToSelectedLang();
  }, [textOutputLang]);

  return (
    <LanguageContext.Provider value={[textResultOriginal, setTextResultOriginal, setTextResult]} >

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
              <p>{textResult}</p>
            </div>
          ) : (
            <div>
              <p>Upload image with text</p>
            </div>
          )}
        </div>
      </div>
    </main>
    </LanguageContext.Provider>

  );
}