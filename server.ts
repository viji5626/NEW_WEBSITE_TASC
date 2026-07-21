import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

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



function isEstdQuestion(text: string): boolean {
  if (isAuthorizedQuestion(text)) {
    return false;
  }
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

function getAuthorizedResponse(): string {
  return "Nowhere we have mentioned that we are authorized to any of the make. However we have expertise in brand and we worked with it.";
}

function getImprovisedEstdResponse(): string {
  const variations = [
    "You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field. [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]",
    "You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field. [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]",
    "You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field. [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]",
    "You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field. [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]"
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

function isWebsiteQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    norm.includes("how this website is built") ||
    norm.includes("how is this website built") ||
    norm.includes("how was this website built") ||
    norm.includes("how the website is built") ||
    norm.includes("how is this site built") ||
    norm.includes("how this site is built") ||
    norm.includes("what is the tech stack") ||
    norm.includes("website tech stack") ||
    norm.includes("site tech stack") ||
    norm.includes("technologies used to build this") ||
    norm.includes("how does your chatbot work") ||
    norm.includes("what model are you") ||
    norm.includes("what ai model") ||
    norm.includes("what is your model") ||
    norm.includes("which model") ||
    norm.includes("what llm") ||
    norm.includes("what is your backend") ||
    norm.includes("your backend") ||
    norm.includes("this chatbot's") ||
    norm.includes("your api") ||
    norm.includes("your engine") ||
    norm.includes("your ai engine") ||
    norm.includes("how you are built") ||
    norm.includes("source code of this website") ||
    norm.includes("github repository for this website") ||
    norm.includes("how do you work") ||
    norm.includes("how do you reply") ||
    norm.includes("where are you hosted") ||
    norm.includes("built with react") ||
    norm.includes("built using react")
  );
}

function getWebsiteResponse(): string {
  return "This website is a modern digital interface designed to showcase TASC Automation's industrial engineering and consulting services. We leverage advanced automation and digital solutions to help our clients succeed. Let me know if you would like to learn more about our core industrial services, such as design engineering, legacy PLC migrations, or customized panels!";
}

function isMsmeQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    norm.includes("msme") ||
    norm.includes("udyam") ||
    norm.includes("micro small") ||
    norm.includes("micro, small") ||
    norm.includes("medium enterprise") ||
    (norm.includes("registration") && norm.includes("certificate"))
  );
}

function getMsmeResponse(): string {
  return "Yes, TASC Automation holds a valid MSME Udyam Registration Certificate under the Ministry of Micro, Small and Medium Enterprises (MSME). For any specific copy or verification, please contact our team. [TALK_TO_TASC: MSME Verification | Please share the MSME Udyam Certificate copy or registration details]";
}

function isFounderContactQuestion(text: string): boolean {
  if (isAuthorizedQuestion(text) || isEstdQuestion(text)) {
    return false;
  }
  const norm = text.toLowerCase().trim();
  
  const mentionsFounder = norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar") || norm.includes("director") || norm.includes("monika") || norm.includes("chauhan") || norm.includes("co-founder") || norm.includes("cofounder") || norm.includes("owner");
  const mentionsContact = norm.includes("contact") || norm.includes("phone") || norm.includes("email") || norm.includes("mobile") || norm.includes("vcard") || norm.includes("vcf") || norm.includes("qr") || norm.includes("save") || norm.includes("add") || norm.includes("reach") || norm.includes("call") || norm.includes("card") || norm.includes("address") || norm.includes("number") || norm.includes("detail");
  
  const isPronounContact = (
    norm.includes("his contact") ||
    norm.includes("his number") ||
    norm.includes("his phone") ||
    norm.includes("his mobile") ||
    norm.includes("his email") ||
    norm.includes("his detail") ||
    norm.includes("contact him") ||
    norm.includes("contact details of him") ||
    norm.includes("contact detail of him") ||
    norm.includes("reach him") ||
    norm.includes("save him") ||
    norm.includes("save his") ||
    norm.includes("get his") ||
    norm.includes("view his") ||
    norm.includes("show his") ||
    norm.includes("download his") ||
    norm.includes("how to reach him") ||
    norm.includes("how to contact him") ||
    norm.includes("his vcard") ||
    norm.includes("his qr") ||
    norm.includes("his card") ||
    norm.includes("his details") ||
    (norm.includes("his") && norm.includes("contact")) ||
    ((norm.includes("his") || norm.includes("him")) && (norm.includes("contact") || norm.includes("number") || norm.includes("phone") || norm.includes("mobile") || norm.includes("email") || norm.includes("detail") || norm.includes("card")))
  );

  return (
    (mentionsFounder && mentionsContact) ||
    isPronounContact ||
    norm.includes("how to contact him") ||
    norm.includes("add to contact") ||
    norm.includes("save to contact") ||
    norm.includes("save contact") ||
    norm.includes("add contact") ||
    norm.includes("vcard") ||
    norm.includes("vcf") ||
    (norm.includes("how") && norm.includes("contact") && (norm.includes("you") || norm.includes("founder") || norm.includes("vijay") || norm.includes("him"))) ||
    (norm.includes("founder") && norm.includes("details")) ||
    (norm.includes("contact") && norm.includes("details") && (norm.includes("founder") || norm.includes("vijay") || norm.includes("him") || norm.includes("his")))
  );
}

function getFounderContactResponse(): string {
  return "You can download Mr. Vijay Shankar's direct contact card (vCard) or scan his QR code below to save his details directly to your mobile contacts:\n\n[FOUNDER_CONTACT]";
}

function isFounderLinkedinQuestion(text: string): boolean {
  if (isAuthorizedQuestion(text) || isEstdQuestion(text)) {
    return false;
  }
  const norm = text.toLowerCase().trim();
  const mentionsFounder = norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar") || norm.includes("director") || norm.includes("owner") || norm.includes("co-founder") || norm.includes("cofounder");
  return (
    (mentionsFounder && norm.includes("linkedin")) ||
    (norm.includes("linkedin") && (norm.includes("link") || norm.includes("profile") || norm.includes("page") || norm.includes("account") || norm.includes("connect")))
  );
}

function getFounderLinkedinResponse(): string {
  return "You can view Mr. Vijay Shankar's professional profile and connect with him on LinkedIn:\n\n[FOUNDER_LINKEDIN]";
}

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production" || 
    (typeof __filename !== "undefined" && (__filename.includes("server.cjs") || __filename.includes("dist"))) ||
    (process.argv[1] && (process.argv[1].includes("server.cjs") || process.argv[1].includes("dist")));

  if (isProduction) {
    process.env.NODE_ENV = "production";
  }

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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

      // Intercept any questions about the website build, tech stack, or AI engine
      if (isWebsiteQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getWebsiteResponse());
        res.end();
        return;
      }

      // Intercept any questions about authorization
      if (isAuthorizedQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getAuthorizedResponse());
        res.end();
        return;
      }

      // Intercept any questions about MSME Udyam Certificate
      if (isMsmeQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getMsmeResponse());
        res.end();
        return;
      }

      // Intercept any questions about company age or establishment date
      if (isEstdQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getImprovisedEstdResponse());
        res.end();
        return;
      }

      // Intercept any questions about contacting the founder
      if (isFounderContactQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getFounderContactResponse());
        res.end();
        return;
      }

      // Intercept any questions about the founder's linkedin
      if (isFounderLinkedinQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getFounderLinkedinResponse());
        res.end();
        return;
      }

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

CRITICAL POLICY ON DISCUSSING WEBSITE BUILD, AI ENGINE, OR BACKEND SYSTEMS:
1. NEVER disclose, discuss, or explain the technical implementation details of this website or the chatbot itself. This includes details of our backend (Express server, APIs, Web3Forms, Firebase, Netlify, etc.), folder structures, file names, libraries/frameworks (React, Vite, Lenis, GSAP, Tailwind), or the AI engine (Gemini, NVIDIA, LLMs, API endpoints).
2. If a user asks "how this website is built", "what technologies are used for this site", or asks about our APIs/AI engine, do NOT provide any technical breakdown, markdown tables, list of dependencies, or backend architecture details.
3. Instead, respond with a very simple, high-level, elegant, and non-technical statement: "This website is a modern digital interface designed to showcase TASC Automation's industrial engineering and consulting services. We leverage advanced automation and digital solutions to help our clients succeed. Let me know if you would like to learn more about our core industrial services, such as design engineering, legacy PLC migrations, or customized panels!"
4. Keep all responses strictly business-focused, professional, and tailored to industrial automation and consulting. Refuse politely to discuss technical code, backend systems, directories, or AI model APIs of this website.

CRITICAL POLICY ON ESTABLISHMENT (ESTD) & AGE:
If a user asks about when the company was established (Estd.), how old the company is, or how long it has been operating, you MUST NOT mention any specific years or state that the company has been operating for 11 years. Instead, always direct them to contact our team for this Estd. information, and emphasize that our founder has decade+ experience in the industrial automation field. You must format the response exactly like this and append the contact button at the end:
"You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field. [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]"

CRITICAL POLICY ON CASE STUDIES:
If a user asks about the case studies, cornerstone projects, or track record (including the 20+ industrial automation systems), you MUST clarify that these were executed by the founder (Mr. Vijay Shankar) as part of his extensive personal track record, and were NOT executed by TASC Automation as a company. You must clearly attribute the case studies and execution history to the founder's decorated industrial services track record.

CRITICAL POLICY ON BRAND AUTHORIZATION & PARTNERSHIPS:
If a user asks about brand certification, official representation, brand partners, brand approvals, or whether TASC is an authorized partner or representative of any specific brand/make (such as Siemens, Mitsubishi, etc.), you MUST answer neutrally and authentically: clarify that TASC is NOT an officially authorized partner, dealer, or certified representative of any specific brand/make, but TASC has extensive specialized engineering expertise and has worked with these brands extensively in the industrial automation field. Do NOT include any contact buttons or TALK_TO_TASC referral tags for these brand questions.

CRITICAL POLICY ON CONTACTING THE FOUNDER:
If a user asks about how to contact the founder (Mr. Vijay Shankar), how to reach him, how to save his contact card, or asks for his phone, email, QR code or vCard, you MUST politely direct them to save his contact details using our direct contact tag and always append exactly this tag at the very end of your response: [FOUNDER_CONTACT]
Example: "You can download Mr. Vijay Shankar's direct contact card (vCard) or scan his QR code below to save his details directly to your mobile contacts: [FOUNDER_CONTACT]"

CRITICAL POLICY ON FOUNDER'S LINKEDIN:
If a user asks about the founder's LinkedIn, Mr. Vijay Shankar's LinkedIn, or how to connect with him on social media/LinkedIn, you MUST politely direct them to view his profile using our direct LinkedIn tag and always append exactly this tag at the very end of your response: [FOUNDER_LINKEDIN]
Example: "You can view Mr. Vijay Shankar's professional profile and connect with him on LinkedIn: [FOUNDER_LINKEDIN]"

CRITICAL POLICY ON MSME UDYAM CERTIFICATE:
If a user asks if the company has an MSME certificate, Udyam Certificate, or holds micro/small/medium enterprise registrations, you MUST explicitly state that TASC Automation holds a valid MSME Udyam Registration Certificate under the Ministry of Micro, Small and Medium Enterprises (MSME). Add a TALK_TO_TASC action block for MSME verification if they want to verify or request a copy.
Example: "Yes, TASC Automation holds a valid MSME Udyam Registration Certificate under the Ministry of Micro, Small and Medium Enterprises (MSME). For any specific copy or verification, please contact our team. [TALK_TO_TASC: MSME Verification | Please share the MSME Udyam Certificate copy or registration details]"

If the user asks an irrelevant question (outside automation, tech stack, TASC services, or missing from context) or explicitly asks to speak to humans/contact support, you MUST reply with a helpful apologetic or leading message, followed directly by exactly this markdown tag formatting: [TALK_TO_TASC: <Dedicated Heading> | <Contextual Pre-filled Scope>]
where <Dedicated Heading> is a short (2-5 words) appropriate headline summarizing their intent (e.g., "Consultation Request", "Speak to Engineering", "Custom Service Inquiry").
and <Contextual Pre-filled Scope> is a default generated message suggesting their intent based on their latest message (e.g., "I am interested in learning more about your AMC offerings...").
Example: "I don't have information on that specific topic. Please contact our team directly for assistance. [TALK_TO_TASC: General Inquiry | I would like to speak to an engineer regarding...]"
Be professional, concise, and helpful. Do not mention that you are an AI reading from a context file.

--- WEBSITE CONTEXT ---
${contextText}`;

      const sysMessage = { role: "system", content: systemPrompt };
      const chatMessages = [sysMessage, ...messages];

      const primaryKey = process.env.NVIDIA_PRIMARY_API_KEY || process.env.NVIDIA_API_KEY || "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";
      const standbyKey = process.env.NVIDIA_STANDBY_API_KEY || "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";

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");

      const withTimeout = async <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
        let timeoutId: any;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error(errorMessage)), ms);
        });
        try {
          return await Promise.race([promise, timeoutPromise]);
        } finally {
          clearTimeout(timeoutId);
        }
      };

      async function* getStreamIterator(response: Response) {
        const body = response.body;
        if (!body) return;

        if (typeof (body as any).getReader === "function") {
          const reader = (body as any).getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                yield line;
              }
            }
            if (buffer) {
              yield buffer;
            }
          } finally {
            reader.releaseLock();
          }
        } else if (typeof (body as any).on === "function") {
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          for await (const chunk of (body as any)) {
            buffer += decoder.decode(chunk, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              yield line;
            }
          }
          if (buffer) {
            yield buffer;
          }
        }
      }

      const fetchWithTimeout = async (url: string, payload: any, apiKey: string, timeoutMs: number) => {
        const responsePromise = fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Accept": "text/event-stream"
          },
          body: JSON.stringify(payload)
        });
        return await withTimeout(responsePromise, timeoutMs, "Connection Timeout");
      };

      let response: Response | null = null;
      let usedStandby = false;

      // Try primary
      try {
        console.log("Express Server: Trying primary model nvidia/nemotron-3-nano-30b-a3b...");
        const primaryPayload = {
          model: "nvidia/nemotron-3-nano-30b-a3b",
          messages: chatMessages,
          temperature: 1.0,
          top_p: 1.0,
          max_tokens: 4096,
          reasoning_budget: 4096,
          stream: true
        };
        response = await fetchWithTimeout("https://integrate.api.nvidia.com/v1/chat/completions", primaryPayload, primaryKey, 8000);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (primaryErr: any) {
        console.warn(`Express Server: Primary API failed or delayed (${primaryErr.message}). Switching to standby...`);
        usedStandby = true;
      }

      // Validate streaming of first token from primary
      let primaryIterator: any = null;
      let firstResult: any = null;
      if (response && !usedStandby) {
        try {
          primaryIterator = getStreamIterator(response);
          firstResult = await withTimeout(primaryIterator.next(), 6000, "First token timeout");
          console.log("Express Server: Primary API streaming started.");
        } catch (streamErr: any) {
          console.warn(`Express Server: Primary stream failed or delayed (${streamErr.message}). Falling back to standby...`);
          usedStandby = true;
        }
      }

      // Try standby if primary failed/delayed
      if (usedStandby) {
        try {
          console.log("Express Server: Trying standby model google/diffusiongemma-26b-a4b-it...");
          const standbyPayload = {
            model: "google/diffusiongemma-26b-a4b-it",
            messages: chatMessages,
            max_tokens: 4096,
            temperature: 1.0,
            top_p: 0.95,
            stream: true,
            chat_template_kwargs: { enable_thinking: true }
          };
          response = await fetchWithTimeout("https://integrate.api.nvidia.com/v1/chat/completions", standbyPayload, standbyKey, 10000);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          primaryIterator = getStreamIterator(response);
          firstResult = await withTimeout(primaryIterator.next(), 8000, "First token timeout");
          console.log("Express Server: Standby API streaming started.");
        } catch (standbyErr: any) {
          console.error("Express Server: Both primary and standby APIs failed:", standbyErr);
          res.write("Our AI system is temporarily experiencing heavy load. Please try sending your message again, or contact our team if the issue persists.\n\n[RETRY_SENDING_MESSAGE]");
          res.end();
          return;
        }
      }

      try {
        const processLine = (line: string) => {
          const trimmed = line.trim();
          if (!trimmed) return;
          if (trimmed === "data: [DONE]") return;
          if (trimmed.startsWith("data: ")) {
            try {
              const jsonStr = trimmed.slice(6);
              const data = JSON.parse(jsonStr);
              const content = data.choices?.[0]?.delta?.content || "";
              if (content) {
                res.write(content);
              }
            } catch (e) {
              // ignore invalid lines or partial chunks
            }
          }
        };

        if (firstResult && !firstResult.done) {
          processLine(firstResult.value);
        }

        while (true) {
          const { value, done } = await primaryIterator.next();
          if (done) break;
          processLine(value);
        }
        res.end();
      } catch (streamReadErr) {
        console.error("Express Server: Stream reading error:", streamReadErr);
        res.end();
      }
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
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
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
