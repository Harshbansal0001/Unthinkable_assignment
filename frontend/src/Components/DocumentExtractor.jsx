// src/components/DocumentExtractor.js
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import './DocumentExtractor.css';
const DocumentExtractor = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [error, setError] = useState(null);
  const [processingStage, setProcessingStage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSummary(null);
    setExtractedText('');
  };

  const handleProcessDocument = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setProcessingStage('Extracting text...');

    const formData = new FormData();
    formData.append('document', file);

    try {
      // Step 1: Extract text
      const extractResponse = await fetch('http://localhost:5000/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        throw new Error('Text extraction failed');
      }

      const extractData = await extractResponse.json();
      setExtractedText(extractData.text);

      // Step 2: Generate summary
      setProcessingStage('Generating summary...');
      const summaryResponse = await fetch('http://localhost:5000/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractData.text,
          length: summaryLength
        }),
      });

      if (!summaryResponse.ok) {
        throw new Error('Summary generation failed');
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      setError(`Processing failed: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Document Processor</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary Length
          </label>
          <select
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
            className="block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="short">Short (2-3 sentences)</option>
            <option value="medium">Medium (4-5 sentences)</option>
            <option value="long">Long (7-8 sentences)</option>
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-600">
              Drop your file here or click to browse
            </span>
            <span className="text-sm text-gray-500 mt-1">
              Supports PDF and image files
            </span>
          </label>
          {file && (
            <div className="mt-4 text-sm text-gray-600">
              Selected: {file.name}
            </div>
          )}
        </div>

        <button
          onClick={handleProcessDocument}
          disabled={loading || !file}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium
            ${loading || !file 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {loading ? processingStage : 'Process Document'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Document Summary</h2>
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium mb-2">Key Points:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
              <h3 className="font-medium mt-4 mb-2">Summary:</h3>
              <p className="text-gray-700">{summary.summary}</p>
            </div>
          </div>
        )}

        {extractedText && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Full Extracted Text</h2>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
              {extractedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentExtractor;