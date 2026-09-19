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

function shouldIncludeCTA(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    norm.includes("contact") ||
    norm.includes("talk to") ||
    norm.includes("reach out") ||
    norm.includes("get in touch") ||
    norm.includes("quote") ||
    norm.includes("discuss") ||
    norm.includes("hire") ||
    norm.includes("for us") ||
    norm.includes("for me") ||
    norm.includes("pricing") ||
    norm.includes("price") ||
    norm.includes("cost") ||
    norm.includes("how to get") ||
    norm.includes("how can i") ||
    norm.includes("interested") ||
    norm.includes("want it") ||
    norm.includes("want this") ||
    norm.includes("need this") ||
    norm.includes("need it") ||
    norm.includes("order") ||
    norm.includes("button") ||
    norm.includes("link") ||
    norm.includes("email") ||
    norm.includes("phone") ||
    norm.includes("number") ||
    norm.includes("vcard") ||
    norm.includes("connect") ||
    norm.includes("request") ||
    norm.includes("call") ||
    norm.includes("appointment") ||
    norm.includes("meeting") ||
    norm.includes("consult") ||
    norm.includes("work with") ||
    norm.includes("help us") ||
    norm.includes("help me")
  );
}

function getAuthorizedResponse(userMsg?: string): string {
  const base = "While TASC Automation is an independent systems integrator and consulting firm (and not an officially authorized partner or distributor for specific OEM brands like Mitsubishi, Siemens, or ABB), we possess deep, hands-on engineering expertise and decades of practical experience working with these brands' platforms. We regularly design, integrate, program, and migrate hardware and software systems from these and other major manufacturers to deliver optimal industrial automation solutions for our clients.\n\nWe would be glad to discuss your project requirements or system integration needs!";
  if (userMsg && shouldIncludeCTA(userMsg)) {
    return base + " [TALK_TO_TASC: OEM Integration Inquiry | Project discussion for Mitsubishi, Siemens, and other brand hardware]";
  }
  return base;
}

function getImprovisedEstdResponse(userMsg?: string): string {
  const base = "You can contact our team for this Estd. information. However, our founder has a decade+ of experience in the industrial automation field.";
  if (userMsg && shouldIncludeCTA(userMsg)) {
    return base + " [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]";
  }
  return base;
}

function isBuiltByTascQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    (norm.includes("build") || norm.includes("built") || norm.includes("made") || norm.includes("create") || norm.includes("design") || norm.includes("develop")) &&
    (norm.includes("tasc") || norm.includes("you ") || norm.includes("your team") || norm.includes("who built this") || norm.includes("who made this") || norm.includes("who created this") || norm.includes("is it build by") || norm.includes("is this built by"))
  );
}

function getBuiltByTascResponse(userMsg?: string): string {
  const base = "Yes! This website and its integrated AI assistant were designed, developed, and deployed entirely by TASC Automation's in-house engineering team. It serves as a live demonstration of our rapid full-stack digital development and custom AI orchestration capabilities. We can design, build, and deploy similar highly polished, responsive, and intelligent digital interfaces tailored specifically for your company's industrial operations, telemetry dashboards, or client-facing portals.";
  if (userMsg && shouldIncludeCTA(userMsg)) {
    return base + " [TALK_TO_TASC: Custom App Request | Discuss custom software or AI agent development with an engineer]";
  }
  return base;
}

function isCanTascBuildQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    (norm.includes("can you") || norm.includes("can tasc") || norm.includes("could you") || norm.includes("build for us") || norm.includes("make a website") || norm.includes("make an app") || norm.includes("build this kind") || norm.includes("build websites") || norm.includes("develop websites") || norm.includes("build a chatbot")) &&
    (norm.includes("website") || norm.includes("site") || norm.includes("app ") || norm.includes("application") || norm.includes("software") || norm.includes("chatbot") || norm.includes("this kind") || norm.includes("for us") || norm.includes("for me") || norm.includes("client"))
  );
}

function getCanTascBuildResponse(userMsg?: string): string {
  const base = "Yes, absolutely! Custom full-stack web applications, industrial telemetry dashboards, responsive client portals, and bespoke AI/RAG integrations are core pillars of TASC Automation's Rapid Deployment services. We design and deliver production-ready digital architectures utilizing modern React, TypeScript, and SQL databases, integrated with intelligent LLM pipelines. We would be glad to design and build a customized solution tailored specifically to your operational requirements.";
  if (userMsg && shouldIncludeCTA(userMsg)) {
    return base + " [TALK_TO_TASC: Custom App Request | Discuss custom software or AI agent development with an engineer]";
  }
  return base;
}

function isChatbotModelQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    norm.includes("which ai") ||
    norm.includes("what ai") ||
    norm.includes("what model") ||
    norm.includes("what is your model") ||
    norm.includes("which model") ||
    norm.includes("what llm") ||
    norm.includes("which llm") ||
    norm.includes("how does your chatbot work") ||
    norm.includes("what is your engine") ||
    norm.includes("what ai engine") ||
    norm.includes("chatbot's engine")
  );
}

function getChatbotModelResponse(userMsg?: string): string {
  const base = "The TASC AI System is powered by state-of-the-art Large Language Models (LLMs) integrated via custom server-side orchestration and Retrieval-Augmented Generation (RAG). This allows the assistant to securely, accurately, and contextually answer queries based strictly on TASC Automation's specialized industrial knowledge base. TASC Automation specializes in deploying custom localized LLM architectures, intelligent autonomous agents, and RAG pipelines (using leading models, Ollama, LM Studio, and vector databases) that run securely offline or on-premise using your proprietary company data.";
  if (userMsg && shouldIncludeCTA(userMsg)) {
    return base + " [TALK_TO_TASC: AI Integration Request | Learn more about deploying localized LLMs and AI agents for your business]";
  }
  return base;
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
    norm.includes("what is your backend") ||
    norm.includes("your backend") ||
    norm.includes("your api") ||
    norm.includes("source code of this website") ||
    norm.includes("github repository for this website") ||
    norm.includes("where are you hosted") ||
    norm.includes("built with react") ||
    norm.includes("built using react")
  );
}

function getWebsiteResponse(userMsg?: string): string {
  const base = "This website is a modern, high-performance digital interface designed and developed by TASC Automation to showcase our industrial automation, engineering consulting, and custom software services. It leverages ultra-quick full-stack web technology paired with intelligent AI orchestration. We specialize in building and deploying customized full-stack applications, industrial dashboards, and localized AI models for our clients to streamline their industrial and business processes.";
  if (userMsg && shouldIncludeCTA(userMsg)) {
    return base + " [TALK_TO_TASC: Custom App Request | Request a quote or discuss a custom software project]";
  }
  return base;
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

function getMsmeResponse(userMsg?: string): string {
  const base = "Yes, TASC Automation holds a valid MSME Udyam Registration Certificate under the Ministry of Micro, Small and Medium Enterprises (MSME). For any specific copy or verification, please contact our team.";
  if (userMsg && shouldIncludeCTA(userMsg)) {
    return base + " [TALK_TO_TASC: MSME Verification | Please share the MSME Udyam Certificate copy or registration details]";
  }
  return base;
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

  // Canonical Cloudflare Turnstile Server Verification according to Cloudflare Spin specs
  async function verifyTurnstileToken(
    token?: unknown,
    clientIp?: string,
    expectedAction = "contact"
  ): Promise<{ success: boolean; action?: string; hostname?: string; errorCodes?: string[] }> {
    if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
      return { success: false, errorCodes: ["missing-input-response"] };
    }

    const secretKey =
      process.env.TURNSTILE_SECRET ||
      "1x0000000000000000000000000000000AA";

    const expectedHostnames = new Set(
      (process.env.TURNSTILE_HOSTNAMES ?? "")
        .split(",")
        .map((hostname) => hostname.trim())
        .filter(Boolean)
    );

    try {
      const formData = new URLSearchParams({
        secret: secretKey,
        response: token
      });
      if (clientIp) {
        formData.append("remoteip", clientIp);
      }

      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
        body: formData
      });

      if (!response.ok) {
        throw new Error(`siteverify ${response.status}`);
      }

      const outcome = await response.json();
      const success = Boolean(outcome.success);

      if (!success) {
        return {
          success: false,
          errorCodes: outcome["error-codes"] || ["validation_failed"]
        };
      }

      // Check action if present on token outcome
      if (outcome.action && outcome.action !== expectedAction) {
        return {
          success: false,
          errorCodes: ["action_mismatch"]
        };
      }

      // Check hostnames if configured
      if (expectedHostnames.size > 0 && outcome.hostname && !expectedHostnames.has(outcome.hostname)) {
        return {
          success: false,
          errorCodes: ["hostname_mismatch"]
        };
      }

      return {
        success: true,
        action: outcome.action,
        hostname: outcome.hostname,
        errorCodes: []
      };
    } catch (err) {
      console.warn("Cloudflare Turnstile verification fallback:", err);
      // In development or when Cloudflare test keys are active without secret, allow safe fallback
      const isTestSecret = secretKey.startsWith("1x") || secretKey.startsWith("2x") || secretKey.startsWith("3x");
      return { success: isTestSecret, errorCodes: ["network_or_service_error"] };
    }
  }

  // Cloudflare Turnstile Verification API Route
  app.post("/api/turnstile/verify", async (req, res) => {
    try {
      const token = req.body["cf-turnstile-response"] || req.body.token || req.body.turnstileToken;
      const clientIp = (req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress) as string | undefined;
      const result = await verifyTurnstileToken(token, clientIp, req.body.action || "contact");

      if (result.success) {
        res.status(200).json({ success: true, message: "Turnstile validation passed" });
      } else {
        res.status(400).json({ success: false, message: "Turnstile challenge failed", errors: result.errorCodes });
      }
    } catch (error) {
      console.error("Turnstile endpoint error:", error);
      res.status(500).json({ success: false, message: "Server error during verification" });
    }
  });

  app.post("/api/contact/email", async (req, res) => {
    // Contact submission handler gated on Turnstile validation
    try {
      const token = req.body["cf-turnstile-response"] || req.body.turnstileToken;
      const clientIp = (req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress) as string | undefined;

      // Gate: verify Turnstile token
      const hasSecret = Boolean(process.env.TURNSTILE_SECRET);
      if (token || hasSecret) {
        const verification = await verifyTurnstileToken(token, clientIp, "contact");
        if (!verification.success && hasSecret) {
          res.status(403).json({ success: false, message: "Turnstile bot verification failed", errors: verification.errorCodes });
          return;
        }
      }

      const packetId = Math.floor(100000 + Math.random() * 900000).toString();
      const { name, email, organization, project_scope, subject, from_name, replyto } = req.body;
      
      const payload: Record<string, any> = {
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

      if (token) {
        payload["cf-turnstile-response"] = token;
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      let data: any = {};
      const rawText = await response.text();
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { success: response.ok, message: response.ok ? "Transmission delivered" : "Upstream gateway response" };
      }
      
      if (response.ok && (data.success !== false)) {
         res.status(200).json({ success: true, packetId, message: "Transmission acknowledged" });
      } else {
         res.status(response.ok ? 200 : 502).json({ success: false, message: data.message || "Failed to transmit packet" });
      }
    } catch (error) {
       console.error("Transmission error:", error);
       res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Chatbot Route
  app.post("/api/chat", async (req, res) => {
    try {
      const messages = req.body.messages || [];
      const userMsg = messages[messages.length - 1]?.content || "";

      // Intercept questions about whether TASC built this website/chatbot
      if (isBuiltByTascQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getBuiltByTascResponse(userMsg));
        res.end();
        return;
      }

      // Intercept questions about whether TASC can build custom websites, apps, or chatbots for clients
      if (isCanTascBuildQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getCanTascBuildResponse(userMsg));
        res.end();
        return;
      }

      // Intercept questions about which AI or LLM is powering this chatbot
      if (isChatbotModelQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getChatbotModelResponse(userMsg));
        res.end();
        return;
      }

      // Intercept any questions about the website build, tech stack, or AI engine
      if (isWebsiteQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getWebsiteResponse(userMsg));
        res.end();
        return;
      }

      // Intercept any questions about authorization
      if (isAuthorizedQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getAuthorizedResponse(userMsg));
        res.end();
        return;
      }

      // Intercept any questions about MSME Udyam Certificate
      if (isMsmeQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getMsmeResponse(userMsg));
        res.end();
        return;
      }

      // Intercept any questions about company age or establishment date
      if (isEstdQuestion(userMsg)) {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getImprovisedEstdResponse(userMsg));
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
        // Keep context within snappy prefill token boundaries
        if (contextText.length > 80000) {
          contextText = contextText.substring(0, 80000) + "... (truncated)";
        }
      } catch (err) {
        console.error("Context reading error:", err);
      }

      const systemPrompt = `You are the official AI Assistant for TASC Automation (tascautomation.com). You represent TASC Automation exclusively. You help visitors with questions strictly based on TASC Automation, its industrial engineering services, automation solutions, industrial consulting, PLC/SCADA systems, control panels, company capabilities, and website content.

CRITICAL POLICY: STRICT DOMAIN BOUNDARY & OUT-OF-SCOPE HANDLING:
1. NEVER FULFILL OFF-TOPIC, UNRELATED, OR GENERAL AI REQUESTS:
   - You MUST NEVER write code for unrelated applications, websites, or programming tasks (e.g. building HTML calculators, todo lists, snake games, Python/Java/JS scripts, website templates, or programming tutorials).
   - You MUST NEVER write general essays, poems, song lyrics, cooking recipes, solve math homework, answer general trivia (history, geography, sports, cinema, politics), or discuss topics unrelated to industrial automation and TASC Automation.
   - Do NOT act as a generic AI assistant or coding playground. Fulfilling unrelated requests exhausts token quotas and distracts from our business.

2. HOW TO RESPOND TO OUT-OF-SCOPE / OFF-TOPIC QUESTIONS:
   - ONLY apply this rule when a question is clearly unrelated or off-topic (e.g., coding unrelated apps like calculators/games/scripts, general trivia, homework, recipes, personal chat).
   - For legitimate questions about TASC Automation, industrial automation, engineering, case studies, control panels, PLC/SCADA, or services, ALWAYS answer DIRECTLY, accurately, and professionally using the website context without any refusal or redirection phrasing.
   - Whenever a visitor asks an off-topic or unrelated question (e.g., "build a calculator in html", "write a python script", "what is the capital of France", "tell me a joke", "write a poem", "solve this equation"):
   - Generate a UNIQUE, fresh response every single time (do NOT repeat canned lines).
   - Keep your response brief and concise (2 to 3 sentences maximum, and NEVER output code blocks or \`\`\`) to preserve API tokens and respond fast.
   - Use a polite, friendly, and lightly humorous or witty tone: playfully acknowledge that while you might secretly know the answer or could code that in your digital circuits, you are 100% dedicated to TASC Automation and industrial engineering!
   - Ensure the language is always pleasant, warm, respectful, and courteous so no user ever feels offended or scolded.
   - Warmly steer and prompt the visitor back to TASC Automation by proactively suggesting 2 to 3 interesting website/service topics they can explore instead (such as our PLC migrations, custom industrial control panels, SCADA & telemetry dashboards, or industrial automation consulting).
   - Tone & style examples for inspiration (always generate your own unique variation):
     * "Haha, as much as my circuits would love to flex their coding muscles on an HTML calculator, I'm exclusively wired for heavy-duty industrial automation at TASC! How about we calculate something exciting for your plant—like optimizing cycle times or modernizing your legacy PLCs? What industrial challenges can we help you solve?"
     * "I might have a few calculator tricks tucked away in my memory banks, but my real passion is industrial engineering and automated systems at TASC Automation! Why not ask me about our custom control panels, SCADA systems, or automation consulting instead?"
     * "It looks like your curiosity is running on a different frequency today! While I could probably write that code, I'm dedicated strictly to TASC Automation's industrial engineering and consulting services. Can I tell you about how we handle PLC migrations, customized electrical panels, or plant automation?"

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

If the user explicitly asks to speak to humans or contact support, you MUST reply with a helpful message, followed directly by exactly this markdown tag formatting: [TALK_TO_TASC: <Dedicated Heading> | <Contextual Pre-filled Scope>]
where <Dedicated Heading> is a short (2-5 words) appropriate headline summarizing their intent (e.g., "Consultation Request", "Speak to Engineering", "Custom Service Inquiry").
and <Contextual Pre-filled Scope> is a default generated message suggesting their intent based on their latest message (e.g., "I am interested in learning more about your AMC offerings...").
Example: "I would be happy to connect you with our engineering team! [TALK_TO_TASC: Consultation Request | I would like to speak with an engineer regarding...]"
Be professional, concise, and helpful. Do not mention that you are an AI reading from a context file.

--- WEBSITE CONTEXT ---
${contextText}`;

      const sysMessage = { role: "system", content: systemPrompt };
      const chatMessages = [sysMessage, ...messages];

      const primaryKey = (process.env.NVIDIA_PRIMARY_API_KEY || process.env.NVIDIA_API_KEY || "").trim();
      const standbyKey = (process.env.NVIDIA_STANDBY_API_KEY || process.env.NVIDIA_SECONDARY_API_KEY || primaryKey || "").trim();
      const tertiaryKey = (process.env.NVIDIA_TERTIARY_API_KEY || standbyKey || primaryKey || "").trim();

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");

      if (!primaryKey && !standbyKey && !tertiaryKey) {
        console.error("Express Server: No NVIDIA API keys configured in environment.");
        res.status(503).write("AI Assistant is currently offline as API keys are not configured in the environment settings.");
        res.end();
        return;
      }

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

      const primaryModel = process.env.NVIDIA_PRIMARY_MODEL || "meta/llama-3.2-11b-vision-instruct";
      const standbyModel = process.env.NVIDIA_STANDBY_MODEL || "google/diffusiongemma-26b-a4b-it";
      const tertiaryModel = process.env.NVIDIA_TERTIARY_MODEL || "nvidia/nemotron-3-super-120b-a12b";

      // Tier configurations
      const tiers = [
        {
          name: "Primary Tier",
          model: primaryModel,
          key: primaryKey,
          payload: {
            model: primaryModel,
            messages: chatMessages,
            temperature: 1.0,
            top_p: 1.0,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 1024,
            stream: true
          },
          timeout: 10000,
          tokenTimeout: 8000
        },
        {
          name: "Standby Tier",
          model: standbyModel,
          key: standbyKey,
          payload: {
            model: standbyModel,
            messages: chatMessages,
            chat_template_kwargs: {
              enable_thinking: true
            },
            max_tokens: 4096,
            temperature: 1.0,
            top_p: 0.95,
            stream: true
          },
          timeout: 12000,
          tokenTimeout: 9000
        },
        {
          name: "Tertiary Tier",
          model: tertiaryModel,
          key: tertiaryKey,
          payload: {
            model: tertiaryModel,
            messages: chatMessages,
            temperature: 0.5,
            top_p: 1.0,
            max_tokens: 1024,
            stream: true
          },
          timeout: 12000,
          tokenTimeout: 9000
        }
      ];

      let primaryIterator: any = null;
      let firstResult: any = null;
      let streamSuccess = false;

      for (const tier of tiers) {
        if (!tier.key) {
          console.warn(`Express Server: Skipping ${tier.name} (${tier.model}) - no API key configured.`);
          continue;
        }
        try {
          console.log(`Express Server: Attempting ${tier.name} with model: ${tier.model}...`);
          const resp = await fetchWithTimeout(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            tier.payload,
            tier.key,
            tier.timeout
          );
          if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
          }
          const iterator = getStreamIterator(resp);
          const result = await withTimeout(iterator.next(), tier.tokenTimeout, "First token timeout");
          primaryIterator = iterator;
          firstResult = result;
          streamSuccess = true;
          console.log(`Express Server: ${tier.name} (${tier.model}) streaming connected successfully.`);
          break;
        } catch (err: any) {
          console.warn(`Express Server: ${tier.name} (${tier.model}) failed: ${err.message}. Cascading to next tier...`);
        }
      }

      if (!streamSuccess || !primaryIterator) {
        console.error("Express Server: All 3 NVIDIA tiers failed.");
        res.write("Our AI system is temporarily experiencing heavy load. Please try sending your message again, or contact our team if the issue persists.\n\n[RETRY_SENDING_MESSAGE]");
        res.end();
        return;
      }

      try {
        let isDone = false;
        const processLine = (line: string) => {
          const trimmed = line.trim();
          if (!trimmed) return;
          if (trimmed === "data: [DONE]" || trimmed.includes("[DONE]")) {
            isDone = true;
            return;
          }
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

        while (!isDone) {
          const { value, done } = await primaryIterator.next();
          if (done) break;
          processLine(value);
          if (isDone) break;
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
