require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'missing-api-key',
});

async function test() {
  const models = ["gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-pro", "gemini-2.0-flash"];
  for (const model of models) {
    try {
      console.log("Testing", model);
      const response = await ai.models.generateContent({
        model: model,
        contents: "hello",
      });
      console.log("Success with", model, ":", response.text);
    } catch (err) {
      console.error("Failed with", model, ":", err.message);
    }
  }
}
test();
