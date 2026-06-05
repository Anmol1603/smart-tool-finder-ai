import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ VITE_GEMINI_API_KEY missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function getRecommendations(query) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are an AI tool recommendation engine.

User goal: "${query}"

Recommend 5 relevant websites, apps, or tools.

Return ONLY a valid JSON array.

Format:

[
  {
    "name": "Tool Name",
    "description": "Short description",
    "category": "Category",
    "pricing": "Free/Paid",
    "website": "https://example.com"
  }
]

Rules:
- Return ONLY JSON
- No markdown
- No explanation
- No extra text
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let text = response.text();

    console.log("RAW RESPONSE:", text);

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(text);

    return parsedData;
  } catch (error) {
    console.error("Gemini Error:", error);

    return [
      {
        name: "ChatGPT",
        description: `AI assistant useful for ${query}`,
        category: "AI",
        pricing: "Free / Paid",
        website: "https://chatgpt.com",
      },
      {
        name: "Google Search",
        description: `Find resources related to ${query}`,
        category: "Search",
        pricing: "Free",
        website: "https://google.com",
      },
      {
        name: "YouTube",
        description: `Watch tutorials about ${query}`,
        category: "Learning",
        pricing: "Free",
        website: "https://youtube.com",
      },
      {
        name: "Reddit",
        description: `Community discussions about ${query}`,
        category: "Community",
        pricing: "Free",
        website: "https://reddit.com",
      },
      {
        name: "GitHub",
        description: `Projects and resources related to ${query}`,
        category: "Development",
        pricing: "Free / Paid",
        website: "https://github.com",
      },
    ];
  }
}