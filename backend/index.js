// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const extractionRoutes = require('./routes/extractionRoutes');
const summaryRoutes = require('./routes/summaryRoutes');


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Routes
app.use('/api', extractionRoutes);
app.use('/api', summaryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Make sure Tesseract OCR is installed for image processing`);
});