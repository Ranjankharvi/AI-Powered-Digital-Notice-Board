// src/services/pdf.js
const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return (pdfData.text || '').trim();
  } catch (err) {
    console.error('PDF extraction failed:', err);
    return '';
  }
}

module.exports = { extractTextFromPDF };
