// List all available Gemini models
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  console.log("🔍 Listing Available Gemini Models...\n");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("❌ GEMINI_API_KEY not found in .env");
    return;
  }

  console.log(
    `✅ API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(
      apiKey.length - 5
    )}\n`
  );

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    console.log("📋 Available models:\n");

    // Try common model names
    const modelsToTry = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.0-pro",
      "models/gemini-pro",
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash",
    ];

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'OK' if you work");
        const response = await result.response;
        const text = response.text();
        console.log(
          `✅ ${modelName} - WORKS! Response: "${text.substring(0, 30)}..."`
        );
      } catch (error) {
        console.log(
          `❌ ${modelName} - Not available (${error.message.split(":")[0]})`
        );
      }
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

listModels();
