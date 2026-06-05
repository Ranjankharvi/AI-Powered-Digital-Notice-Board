// src/utils/fileHelpers.js
const fs = require("fs");
const path = require("path");

/**
 * Deletes a file safely (used when OCR fails or cleanup needed)
 */
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Deleted file:", filePath);
    }
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }
}

/**
 * Checks if file is a PDF
 */
function isPDF(fileName) {
  return path.extname(fileName).toLowerCase() === ".pdf";
}

/**
 * Checks if file is an image (PNG / JPG / JPEG)
 */
function isImage(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return [".png", ".jpg", ".jpeg"].includes(ext);
}

/**
 * Sanitizes any file name to prevent security issues
 */
function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
}

/**
 * Get extension from file path
 */
function getExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

module.exports = {
  deleteFile,
  isPDF,
  isImage,
  sanitizeFileName,
  getExtension
};
