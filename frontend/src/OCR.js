// src/OCR.js
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./OCR.css"; // Import styles for OCR component
function OCR({ imageFile }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const handleOCR = (file) => {
    setIsProcessing(true);
    Tesseract.recognize(
      file,
      "eng",
      {
        logger: (m) => console.log(m), // Logs progress of OCR
      }
    ).then(({ data: { text } }) => {
      setExtractedText(text);
      setIsProcessing(false);
    });
  };

  React.useEffect(() => {
    if (imageFile) {
      handleOCR(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="ocr-container">
      {isProcessing ? (
        <div className="processing">
          <p>Processing image...</p>
        </div>
      ) : (
        <div className="ocr-result">
          <h3>Extracted Text:</h3>
          <textarea
            value={extractedText}
            readOnly
            rows="10"
            cols="50"
            placeholder="Extracted text will appear here..."
          />
        </div>
      )}
    </div>
  );
}

export default OCR;
