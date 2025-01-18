// routes/extractionRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const tesseract = require('node-tesseract-ocr');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Configure Tesseract
const config = {
  lang: 'eng',
  oem: 1,
  psm: 3,
};

// Function to check if tesseract is installed
async function checkTesseract() {
  try {
    await execPromise('tesseract --version');
    return true;
  } catch (error) {
    console.error('Tesseract is not installed or not in PATH:', error);
    return false;
  }
}

// Direct tesseract execution function
async function runTesseractDirectly(filePath) {
  try {
    const { stdout } = await execPromise(`tesseract "${filePath}" stdout -l eng --oem 1 --psm 3`);
    return stdout;
  } catch (error) {
    throw new Error(`Direct Tesseract execution failed: ${error.message}`);
  }
}

router.post('/extract-text', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let extractedText = '';

    if (fileExt === '.pdf') {
      // Handle PDF
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      extractedText = data.text;
    } else if (['.png', '.jpg', '.jpeg'].includes(fileExt)) {
      // Check if Tesseract is installed
      const tesseractInstalled = await checkTesseract();
      
      if (!tesseractInstalled) {
        throw new Error('Tesseract OCR is not properly installed. Please install Tesseract and add it to your system PATH.');
      }

      try {
        // First try with node-tesseract-ocr
        extractedText = await tesseract.recognize(filePath, config);
      } catch (error) {
        console.log('node-tesseract-ocr failed, trying direct execution...');
        // If that fails, try direct execution
        extractedText = await runTesseractDirectly(filePath);
      }
    } else {
      throw new Error('Unsupported file format');
    }

    // Clean up uploaded file
    await fs.unlink(filePath);

    if (!extractedText || extractedText.trim() === '') {
      throw new Error('No text could be extracted from the file');
    }

    res.json({ text: extractedText });
  } catch (error) {
    console.error('Error:', error);
    // Clean up file if it exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ 
      error: 'Failed to extract text',
      details: error.message 
    });
  }
});

module.exports = router;