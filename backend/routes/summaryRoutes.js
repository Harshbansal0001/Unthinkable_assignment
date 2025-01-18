// routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateSummary(text, length) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Clean and prepare the text
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    let promptLength;
    switch (length) {
      case 'short':
        promptLength = '2-3 sentences';
        break;
      case 'medium':
        promptLength = '4-5 sentences';
        break;
      case 'long':
        promptLength = '7-8 sentences';
        break;
      default:
        promptLength = '4-5 sentences';
    }

    const prompt = `Analyze the following text and respond ONLY with a JSON object in this exact format:
    {
      "summary": "your summary here in ${promptLength}",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }

    Text to analyze:
    ${cleanText}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    // Try to extract JSON from the response
    let jsonStr = response.text().trim();
    
    // Remove any markdown code block syntax if present
    jsonStr = jsonStr.replace(/```json\n?|\n?```/g, '');
    
    // Remove any leading/trailing whitespace or quotes
    jsonStr = jsonStr.trim().replace(/^['"`]|['"`]$/g, '');

    try {
      const parsedResponse = JSON.parse(jsonStr);
      
      // Validate the response structure
      if (!parsedResponse.summary || !Array.isArray(parsedResponse.keyPoints)) {
        // If invalid structure, create a fallback response
        return {
          summary: parsedResponse.summary || "Summary could not be generated.",
          keyPoints: Array.isArray(parsedResponse.keyPoints) ? 
            parsedResponse.keyPoints : 
            [parsedResponse.text || "Key points could not be generated."]
        };
      }
      
      return parsedResponse;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw Response:', jsonStr);
      
      // If JSON parsing fails, create a structured response from the raw text
      return {
        summary: "An error occurred while formatting the summary.",
        keyPoints: ["Please try again with a different document or length setting."]
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

router.post('/generate-summary', async (req, res) => {
  try {
    const { text, length } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    if (text.length < 10) {
      return res.status(400).json({ 
        error: 'Text is too short for summarization' 
      });
    }

    const summary = await generateSummary(text, length);
    res.json(summary);
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message,
      summary: "An error occurred while generating the summary.",
      keyPoints: ["Please try again with a different document or length setting."]
    });
  }
});

module.exports = router;