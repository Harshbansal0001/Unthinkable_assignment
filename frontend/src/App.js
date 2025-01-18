// src/App.js
import React from 'react';
import DocumentExtractor from './Components/DocumentExtractor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-50">
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Document Processor</h1>
          <a
            href="#"
            className="text-sm text-blue-100 hover:text-white hover:underline"
          >
            Help
          </a>
        </div>
      </nav>
      <main className="flex flex-col items-center py-10">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
          <DocumentExtractor />
        </div>
      </main>
     
    </div>
  );
}

export default App;