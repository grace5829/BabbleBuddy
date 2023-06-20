import React from "react";
import { useEffect, useState, useContext, createContext } from "react";
import { languages } from "./languages";
import { createWorker } from "tesseract.js";

import {LanguageContext} from "./page.js"

const ImageToText = () => {
    const worker = createWorker();
const  [textResultOriginal, setTextResultOriginal, setTextResult]= useContext(LanguageContext)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLang, setImageLang] = useState("eng");
  const [textInputLang, setTextInputLang] = useState("en");
  const languagesKeys = Object.keys(languages);


  useEffect(() => {
    convertImageToText();
  }, [selectedImage, imageLang]);

  const handleImageLangChange = (evt) => {
    let selectedLang = evt.target.value;
    setImageLang(languages[selectedLang].image);
    setTextInputLang(languages[selectedLang].text);
  };
  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const convertImageToText = async () => {
    await (await worker).loadLanguage(imageLang);
    await (await worker).initialize(imageLang);
    const { data } = await (await worker).recognize(selectedImage);
    setTextResult(data.text);
    setTextResultOriginal(data.text);
    await (await worker).terminate();
  };
  return (
    <div>
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
      <select
        name="image-languages"
        id="image-languages"
        onChange={handleImageLangChange}
      >
        {languagesKeys.map((language) => (
          <option value={language} key={language}>
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
      </div>
    </div>
  );
};

export default ImageToText;
