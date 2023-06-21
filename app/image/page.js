"use client";

import Link from "next/link";
import { useEffect, useState, createContext } from "react";
import ImageToText from "./ImageToText";
import { languages } from "./languages";
// import text.png from "./text.png"

//create api backend route to translate the lanagues?
export const LanguageContext = createContext();

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
      console.log(response.data[0].translations[0].text);
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
    <LanguageContext.Provider
      value={[
        selectedImage,
        setSelectedImage,
        setTextResultOriginal,
        setTextInputLang,
      ]}
    >
      <main className="bg-orange-100"> 
        <div className="flex justify-between bg-orange-200 text-cyan-600 h-12 items-center">
          <div>
            <h1 className="logoName text-3xl font-comicSans mx-1"> Babble Buddy</h1>
          </div>
          <div>
            <Link href="/" className="font-markerFelt text-2xl">Home</Link>
            <Link href="/speech" className="mx-3.5 font-markerFelt text-2xl" >
              Speech
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
        <h3 className="font-gillSans font-medium text-5xl my-4">Image to text!</h3>
        </div>

        <span >

        <div className="mx-32">
          <ImageToText />
          <div className="">
          <div className="mb-2 mt-4 ">
            <label htmlFor="text-languages" className="font-gillSans text-lg">
              Text Language:
            </label>
            <select
              name="text-languages"
              id="text-languages"
              className=""
              onChange={handleTextLangChange}
            >
              {languagesKeys.map((language) => (
                <option value={language} key={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

<span className="flex justify-center  h-40 items-center bg-white">

            {textResult ? (
              <div>{textResult}</div>
            ) : selectedImage ? (
              <p>Select language</p>
            ) : (
              <p>Upload image with text</p>
            )}
</span>
          </div>
        </div>
        </span>

      </main>
    </LanguageContext.Provider>
  );
}
