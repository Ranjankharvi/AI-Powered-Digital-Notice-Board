// src/services/ocr.js
const Tesseract = require('tesseract.js');

async function extractTextFromImage(imagePath) {
  try {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m),
    });

    return (result.data.text || '').trim();
  } catch (err) {
    console.error('OCR extraction failed:', err);
    return '';
  }
}

module.exports = { extractTextFromImage };
