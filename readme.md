# Technical Assesment

## Project Overview
The `unthinkable1` project consists of two main components:
- **Frontend**: Handles the user interface and user interactions.
- **Backend**: Manages server-side processing, including document uploads, text extraction, summary generation, and improvement suggestions.

## Running the Application
To run both the frontend and backend simultaneously, use the following command:

```bash
npm run dev
```

Ensure that all dependencies are installed for both frontend and backend before running the command.

## Features

### 1. Document Upload
- **Supported File Types**: PDF and image files.
- **User-Friendly Upload Options**:  file picker for convenient uploads.

### 2. Text Extraction
- **PDF Parsing**: Extracts text from PDF files while preserving formatting.
- **OCR (Optical Character Recognition)**: Extracts text from image files using OCR technology.

### 3. Summary Generation
- **Automatic Summaries**: Generates intelligent summaries of document using gemini version 1.5.
- **Customizable Length**: Choose between short, medium, and long summaries.
- **Key Highlights**: Emphasizes main ideas and critical points to capture essential information effectively.

### 5. UI/UX
- **Simple and Intuitive Interface**: Easy to navigate for all user types.

## Technologies Used
- **Frontend**: [Specify the technologies, e.g., React]
- **Backend**: [Specify the technologies, e.g., Node.js, Express]
- **OCR Technology**: Tesseract (or other libraries used for text recognition)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd unthinkable1
   ```

2. Navigate to the `frontend` and `backend` directories and install dependencies:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. In the backend, create a `.env` file and add the following:
   ```env
   GEMINI_API_KEY=Please add api key from LLM
   ```
4. Run the application:
   ```bash
   npm run dev
   ```

## License
Created my Harsh Bansal for Personal use .

"# Unthinkable_assignment" 
