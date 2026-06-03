import { GoogleGenAI } from "@google/genai";

export const handler = async (event: any, context: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { message } = body;
    
    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: "Message is required" }) };
    }

    if (!process.env.GEMINI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemInstruction = `You are the official AI assistant for TASC (Tenacious Automation Solutions & Consulting).
Answer questions strictly based on the following website details. If a question is outside this scope, politely decline and state you can only answer questions about TASC services, or advise them to contact info@tascautomation.com or +91-9413668274. Keep answers concise, professional, and clear.

Core Details about TASC:
- Focuses on industrial automation, smart factory solutions, SCADA/HMI integration, DCS architecture, PLC engineering, Industrial AI, and Energy Monitoring Systems.
- Location: Pinder Valley Enclave, Lane-3, Nakronda, Pin-248008, Dehradun, Uttarakhand, IN.
- Global & India Reach.
- We work with brands like Siemens (TIA Portal, PCS 7), Mitsubishi Electric (GX Works, ICONICS), Rockwell/Allen-Bradley, Schneider, and Omron.
- Services include: Consulting (Feasibility Studies, IO sizing, Network Design), execution, Microservices (Web portals, LLM integration, Vibe coding), Turnkey custom MCC/PCC/VFD/PLC panel engineering.
- Hardware Sales: PLC Hardware Sales, VFD Sales, LT Switchgear (Up to 6300 A).
- Contact: info@tascautomation.com, Phone: +91-9413668274
- Lead times: Medium-scale PLC/SCADA migration typically spans 8 to 12 weeks.
- Support: We offer comprehensive AMCs with tiered SLAs.
- Leadership: Founder & Principal Engineer is Mr. Vijay Shankar (11+ years experience). Director is Mrs. Monika Chauhan.
- AI & Edge: We deploy secure Edge AI gateways and localized LLMs.
- Case Studies: Energy Management & Digitalization (Daikin Neemrana), 132 KV Switchyard, Quartz/Iron Ore Beneficiation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: response.text })
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error?.message || "Failed to generate reply from AI" })
    };
  }
};
