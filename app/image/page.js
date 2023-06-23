"use client";

import Link from "next/link";
import { useEffect, useState, createContext } from "react";
import ImageToText from "./ImageToText";
import { languages } from "./languages";
import {useTheme} from "next-themes"
import {ThemeProvider} from 'next-themes'
// import text.png from "./text.png"

//create api backend route to translate the lanagues?
export const LanguageContext = createContext();

export default function ImagePage() {
  const {theme, setTheme}=useTheme()

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
      <main className="light:bg-orange-100 min-h-screen min-w-screen dark:bg-stone-700"> 
        <div className="flex justify-between bg-orange-200 text-cyan-600 h-12 items-center dark:bg-stone-800 dark:text-cyan-700">
          <div>
            <h1 className="logoName text-3xl font-comicSans mx-1"> Babble Buddy</h1>
          </div>
          <div>
            <Link href="/" className="font-markerFelt text-2xl dark:text-cyan-700">Home</Link>
            <Link href="/speech" className="mx-3.5 font-markerFelt text-2xl dark:text-cyan-700" >
              Speech
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
        <h3 className="font-gillSans font-medium my-4 md:text-5xl sm:text-3xl dark:text-emerald-600">Image to text</h3>
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
              className="dark:bg-zinc-500 rounded-md ml-1"
              onChange={handleTextLangChange}
            >
              {languagesKeys.map((language) => (
                <option value={language} key={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

<span className="flex justify-center items-center rounded-md bg-white dark:bg-gray-600">

            {textResult ? (
              <div>{textResult}</div>
            ) : selectedImage ? (
              <p className="md:h-1/2 sm:h-20 flex items-center" >Select language</p>
            ) : (
              <p className="md:h-40 sm:h-20 flex items-center">Upload image with text</p>
            )}
</span>
          </div>
        </div>
        </span>

<div className="h-10"> </div>
<footer className="p-10">
    <span> 
    <span onClick={()=> setTheme("light")}> Light  </span>|
    <span onClick={()=> setTheme("dark")}> Dark  </span>| {theme}
   </span>

     </footer>
      </main>
    </LanguageContext.Provider>
  );
}
