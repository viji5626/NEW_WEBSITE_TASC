import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemInstruction = `You are the official AI assistant for TASC (Tenacious Automation Solutions & Consulting).
Answer questions strictly based on the following website details. If a question is outside this scope, politely decline and state you can only answer questions about TASC services, or advise them to contact info@tascautomation.com or +91-9413668274. Keep answers concise, professional, and clear.

Core Details about TASC:
- Focuses on industrial automation, smart factory solutions, SCADA/HMI integration... (Truncated for brevity in Vercel function, see context).
- Location: Dehradun, Uttarakhand, IN.
- Contact: info@tascautomation.com
- Services: PLC, SCADA, Turnkey custom MCC/PCC.
- Case Studies: Energy Management & Digitalization (Daikin Neemrana), 132 KV Switchyard, Quartz/Iron Ore Beneficiation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    res.status(200).json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate reply from AI" });
  }
}
