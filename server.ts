import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
const app = express();
  const PORT = 3000;

  // --- RAG Pipeline ---
  interface DocumentChunk {
    title: string;
    content: string;
  }
  
  let websiteKnowledge: DocumentChunk[] = [];
  
  function indexWebsiteContent() {
    try {
      websiteKnowledge = [];
      const filesToIndex = [
        { dir: "src/pages", files: ["Home.tsx", "Consulting.tsx", "MicroServices.tsx", "FAQ.tsx"] },
        { dir: "src/components/site", files: ["Amc.tsx", "Capabilities.tsx", "Cases.tsx", "Contact.tsx", "Founder.tsx", "Industries.tsx", "SoftwareExpertise.tsx"] }
      ];
  
      for (const group of filesToIndex) {
        for (const file of group.files) {
          const filePath = path.join(process.cwd(), group.dir, file);
          if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, "utf-8");
            content = content.replace(/import.*from.*;/g, "");
            content = content.replace(/<svg\b[^>]*>(.*?)<\/svg>/gs, "[ICON]");
            content = content.replace(/className="[^"]*"/g, ""); 
            
            websiteKnowledge.push({
              title: file.replace('.tsx', ''),
              content: content.trim()
            });
          }
        }
      }
      console.log(`Indexed ${websiteKnowledge.length} static sections for RAG context.`);
    } catch (error) {
      console.error("Failed to index website content", error);
    }
  }
  
  indexWebsiteContent();
  // --------------------

  app.use(express.json());

  app.post("/api/contact/email", async (req, res) => {
    try {
      const { name, email, organization, project_scope, subject, from_name, replyto } = req.body;
      const packetId = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit number
      
      const payload = {
        access_key: "cc7c2810-6da6-4d9b-b2cc-f3ebc28759d0",
        name,
        email,
        subject: subject || `[TASC] New Consultation — ${organization || name}`,
        from_name: from_name || `TASC Website · ${name}`,
        replyto: replyto || email,
        Organization: organization || "N/A",
        "Project Scope": project_scope,
        "Packet ID": packetId
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
         res.status(200).json({ success: true, packetId, message: "Email sent successfully" });
      } else {
         res.status(500).json({ success: false, message: data.message || "Failed to send email" });
      }
    } catch (error) {
       console.error("Web3Forms proxy error:", error);
       res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Chatbot Route
  app.post("/api/chat", async (req, res) => {
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
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are the official AI assistant for TASC (Tenacious Automation Solutions & Consulting).
Answer questions strictly based on the following website details. If a question is outside this scope, politely decline and state you can only answer questions about TASC services, or advise them to contact info@tascautomation.com or +91-9413668274. Keep answers concise, professional, and clear. Do not use markdown headers; use bolding or lists if necessary.

Core Details about TASC:
- Focuses on industrial automation, smart factory solutions, SCADA/HMI integration, DCS architecture, PLC engineering, Industrial AI, and Energy Monitoring Systems.
- Location: Pinder Valley Enclave, Lane-3, Nakronda, Pin-248008, Dehradun, Uttarakhand, IN.
- Global & India Reach.
- We work with brands like Siemens (TIA Portal, PCS 7), Mitsubishi Electric (GX Works, ICONICS), Rockwell/Allen-Bradley, Schneider, and Omron.
- Services include: Consulting (Feasibility Studies, IO sizing, Network Design), execution, Microservices (Web portals, LLM integration, Vibe coding), Turnkey custom MCC/PCC/VFD/PLC panel engineering.
- Hardware Sales: PLC Hardware Sales, VFD Sales, LT Switchgear (Up to 6300 A).
- Contact: info@tascautomation.com, Phone: +91-9413668274
- Lead times: Medium-scale PLC/SCADA migration typically spans 8 to 12 weeks.
- Support: We offer comprehensive AMCs with tiered SLAs, including 24/7 remote remote diagnostic support and rapid on-site response.
- Leadership: Founder & Principal Engineer is Mr. Vijay Shankar (11+ years experience). Director is Mrs. Monika Chauhan (focuses on HR & strategic management).
- AI & Edge: We deploy secure Edge AI gateways and localized LLMs (like Ollama).
- They also do Website Development, Domain & Web Hosting services.
- Case Studies: 
  1. Energy Management & Digitalization (Daikin Neemrana): Plant-wide EMS on ICONICS GENESIS64 and Mitsubishi MELSEC PLCs. Features SLD, KPIs, alarms, and energy balance.
  2. 132 KV Switchyard Automation System.
  3. Quartz Beneficiation Plant.
  4. Iron Ore Beneficiation Plant.
  5. Quartz Slab Manufacturing Plant.
`;

      const ragContext = websiteKnowledge.map(doc => `--- Website Section: ${doc.title} ---\n${doc.content}`).join("\n\n");
      const finalSystemInstruction = systemInstruction + `\n\n### WEBSITE DATA (Retrieved RAG Context, use this as ground truth for all answers):\n\n` + ragContext;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction: finalSystemInstruction,
        },
      });

      res.status(200).json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate reply from AI" });
    }
  });

  // Web3Forms Initialization
  const getWeb3FormsKey = () => {
    return process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY || process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || "cc7c2810-6da6-4d9b-b2cc-f3ebc28759d0"; 
  };

  // Explicitly serve public files as a fallback
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
