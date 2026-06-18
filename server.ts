import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

function isEstdQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  
  return (
    norm.includes("how old") ||
    norm.includes("howold") ||
    norm.includes("how long") ||
    norm.includes("howlong") ||
    norm.includes("estd") ||
    norm.includes("estb") ||
    norm.includes("establish") ||
    norm.includes("founded") ||
    norm.includes("founding") ||
    norm.includes("incorporat") ||
    norm.includes("start year") ||
    norm.includes("starting year") ||
    norm.includes("launch date") ||
    norm.includes("launch year") ||
    norm.includes("launching year") ||
    norm.includes("years in business") ||
    norm.includes("years old") ||
    norm.includes("age of") ||
    norm.includes("active since") ||
    norm.includes("operating since") ||
    norm.includes("operational since") ||
    norm.includes("running since") ||
    norm.includes("existent since") ||
    (norm.includes("since") && (norm.includes("when") || norm.includes("year") || norm.includes("company") || norm.includes("firm") || norm.includes("tasc") || norm.includes("organization") || norm.includes("business"))) ||
    ((norm.includes("what year") || norm.includes("which year") || norm.includes("when was") || norm.includes("when did")) && (norm.includes("start") || norm.includes("found") || norm.includes("launch") || norm.includes("begin") || norm.includes("setup") || norm.includes("create") || norm.includes("born") || norm.includes("company") || norm.includes("tasc") || norm.includes("firm") || norm.includes("business") || norm.includes("you") || norm.includes("organization")))
  );
}

function getImprovisedEstdResponse(): string {
  const variations = [
    "You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field.\n\n[TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]",
    "Please contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field.\n\n[TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]",
    "To learn specific Estd. information, you can contact to our team. However Founder have decade+ experience in industrial automation field.\n\n[TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]",
    "You can discuss with our team regarding the official Estd. information. However Founder have decade+ experience in industrial automation field.\n\n[TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]"
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

function isAuthorizedQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    norm.includes("authori") || // authorize, authorized, authorization, authorise, authorised, authorisation, etc.
    norm.includes("authri") || // authrized, authrize, etc.
    norm.includes("authr") || // authrise, etc.
    norm.includes("auther") || // autherised, autherized
    norm.includes("partner of") ||
    norm.includes("official partner") ||
    norm.includes("certified partner") ||
    norm.includes("authorized partner") ||
    norm.includes("brand partner") ||
    norm.includes("siemens partner") ||
    norm.includes("mitsubishi partner") ||
    norm.includes("brand approval") ||
    norm.includes("brand certification") ||
    norm.includes("brand certificate") ||
    norm.includes("oem license") ||
    norm.includes("oem certificate") ||
    norm.includes("oem partner") ||
    norm.includes("oem authorization")
  );
}

function getAuthorizedResponse(): string {
  const variations = [
    "For this query, please contact TASC automation team.\n\n[TALK_TO_TASC: Brand Authorization Inquiry | I would like to inquire about TASC's official brand authorizations, certifications, or partnerships.]",
    "For this query, please contact TASC automation team.\n\n[TALK_TO_TASC: Partnership Enquiry | Please contact us regarding certified brand alignments or OEM partner authorizations.]"
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/contact/email", async (req, res) => {
    // ... existing Web3Forms contact logic ...
    try {
      const { name, email, organization, project_scope, subject, from_name, replyto } = req.body;
      const packetId = Math.floor(100000 + Math.random() * 900000).toString();
      
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
      const messages = req.body.messages || [];
      const userMsg = messages[messages.length - 1]?.content || "";

      // Intercept any questions about company age or establishment date
      if (isEstdQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getImprovisedEstdResponse());
        res.end();
        return;
      }

      // Intercept any questions about brand authorization or partnerships
      if (isAuthorizedQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getAuthorizedResponse());
        res.end();
        return;
      }

      const apiKey = process.env.NVIDIA_API_KEY || "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";
      
      const { OpenAI } = await import("openai");
      const client = new OpenAI({
        baseURL: "https://integrate.api.nvidia.com/v1",
        apiKey: apiKey
      });

      let contextText = "";
      try {
        const knowledgeData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "website-knowledge.json"), "utf-8"));
        contextText = knowledgeData.context;
        // Strip out base64 images that might eat tokens
        if (contextText.length > 200000) {
          contextText = contextText.substring(0, 200000) + "... (truncated)";
        }
      } catch (err) {
        console.error("Context reading error:", err);
      }

      const systemPrompt = `You are the TASC AI Assistant for TASC Automation's website. You help visitors answer questions based strictly on the provided website content context.

CRITICAL POLICY ON ESTABLISHMENT (ESTD) & AGE:
If a user asks about when the company was established (Estd.), how old the company is, or how long it has been operating, you MUST NOT mention any specific years or state that the company has been operating for 11 years. Instead, always direct them to contact our team for this Estd. information, and emphasize that our founder has decade+ experience in the industrial automation field. You must format the response exactly like this and append the contact button at the end:
"You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field. [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]"

CRITICAL POLICY ON BRAND AUTHORIZATION & PARTNERSHIPS:
If a user asks anything about brand certification, official representation, brand partners, brand approvals, or whether TASC is authorized for any specific brand, you MUST always reply that for brand authorizations and partnership questions they should contact our team. You must format the response exactly like this:
"For this query, please contact TASC automation team. [TALK_TO_TASC: Brand Authorization Inquiry | I would like to inquire about TASC's official brand authorizations, certifications, or partnerships.]"

If the user asks an irrelevant question (outside automation, tech stack, TASC services, or missing from context) or explicitly asks to speak to humans/contact support, you MUST reply with a helpful apologetic or leading message, followed directly by exactly this markdown tag formatting: [TALK_TO_TASC: <Dedicated Heading> | <Contextual Pre-filled Scope>]
where <Dedicated Heading> is a short (2-5 words) appropriate headline summarizing their intent (e.g., "Consultation Request", "Speak to Engineering", "Custom Service Inquiry").
and <Contextual Pre-filled Scope> is a default generated message suggesting their intent based on their latest message (e.g., "I am interested in learning more about your AMC offerings...").
Example: "I don't have information on that specific topic. Please contact our team directly for assistance. [TALK_TO_TASC: General Inquiry | I would like to speak to an engineer regarding...]"
Be professional, concise, and helpful. Do not mention that you are an AI reading from a context file.

--- WEBSITE CONTEXT ---
${contextText}`;

      const sysMessage = { role: "system", content: systemPrompt };
      const chatMessages = [sysMessage, ...messages];

      const completion = await (client.chat.completions.create as any)({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        messages: chatMessages,
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: 1024,
        // @ts-ignore
        extra_body: { chat_template_kwargs: { enable_thinking: true }, reasoning_budget: 1024 },
        stream: true
      });

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");

      for await (const chunk of completion) {
        if (!chunk.choices || chunk.choices.length === 0) continue;
        const delta = chunk.choices[0].delta as any;
        if (!delta) continue;
        const content = delta.content || "";
        // Note: Nemotron-3 reasoning content can be streamed back if needed, 
        // but for a user-facing chatbot, we usually only care about the final response content.
        // We will just stream back the content part.
        if (content) {
           res.write(content);
        }
      }
      res.end();
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: "Failed to process chat" });
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
