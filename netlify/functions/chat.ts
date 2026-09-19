import type { Config, Context } from "@netlify/functions";
import knowledgeData from "../../website-knowledge.json";

function isAuthorizedQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    norm.includes("authori") ||
    norm.includes("authri") ||
    norm.includes("authr") ||
    norm.includes("auther") ||
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
  const norm = text.toLowerCase().trim();
  return (
    (norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar") || norm.includes("owner") || norm.includes("head") || norm.includes("ceo") || norm.includes("director")) &&
    (norm.includes("contact") || norm.includes("card") || norm.includes("vcard") || norm.includes("qr") || norm.includes("phone") || norm.includes("number") || norm.includes("mobile") || norm.includes("email") || norm.includes("call") || norm.includes("reach") || norm.includes("details"))
  );
}

function getFounderContactResponse(): string {
  return "You can download Mr. Vijay Shankar's direct contact card (vCard) or scan his QR code below to save his details directly to your mobile contacts:\n\n[FOUNDER_CONTACT]";
}

function isFounderLinkedinQuestion(text: string): boolean {
  const norm = text.toLowerCase().trim();
  return (
    (norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar") || norm.includes("owner") || norm.includes("head") || norm.includes("ceo") || norm.includes("director") || norm.includes("he ") || norm.includes("his ")) &&
    (norm.includes("linkedin") || norm.includes("linked in") || norm.includes("profile") || norm.includes("social"))
  );
}

function getFounderLinkedinResponse(): string {
  return "You can view Mr. Vijay Shankar's professional profile and connect with him on LinkedIn:\n\n[FOUNDER_LINKEDIN]";
}

// Timeout Helper
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

// Stream chunk-by-chunk reader compatible with both Browser & Node streams
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

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { messages } = await req.json();
    const userMsg = messages[messages.length - 1]?.content || "";

    // Intercept questions about whether TASC built this website/chatbot
    if (isBuiltByTascQuestion(userMsg)) {
      return new Response(getBuiltByTascResponse(userMsg), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept questions about whether TASC can build custom websites, apps, or chatbots for clients
    if (isCanTascBuildQuestion(userMsg)) {
      return new Response(getCanTascBuildResponse(userMsg), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept questions about which AI or LLM is powering this chatbot
    if (isChatbotModelQuestion(userMsg)) {
      return new Response(getChatbotModelResponse(userMsg), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept any questions about the website build, tech stack, or AI engine
    if (isWebsiteQuestion(userMsg)) {
      return new Response(getWebsiteResponse(userMsg), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept any questions about authorization
    if (isAuthorizedQuestion(userMsg)) {
      return new Response(getAuthorizedResponse(userMsg), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept any questions about MSME Udyam Certificate
    if (isMsmeQuestion(userMsg)) {
      return new Response(getMsmeResponse(userMsg), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept any questions about company age or establishment date
    if (isEstdQuestion(userMsg)) {
      return new Response(getImprovisedEstdResponse(userMsg), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept any questions about contacting the founder
    if (isFounderContactQuestion(userMsg)) {
      return new Response(getFounderContactResponse(), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept any questions about the founder's linkedin
    if (isFounderLinkedinQuestion(userMsg)) {
      return new Response(getFounderLinkedinResponse(), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    const primaryKey = (process.env.NVIDIA_PRIMARY_API_KEY || process.env.NVIDIA_API_KEY || "").trim();
    const standbyKey = (process.env.NVIDIA_STANDBY_API_KEY || process.env.NVIDIA_SECONDARY_API_KEY || primaryKey || "").trim();
    const tertiaryKey = (process.env.NVIDIA_TERTIARY_API_KEY || standbyKey || primaryKey || "").trim();

    if (!primaryKey && !standbyKey && !tertiaryKey) {
      console.error("Netlify Function: No NVIDIA API keys configured in environment.");
      return new Response("AI Assistant is currently offline as API keys are not configured in the environment settings.", {
        status: 503,
        headers: { "Content-Type": "text/plain" }
      });
    }

    let contextText = knowledgeData.context || "";
    if (contextText.length > 80000) {
      contextText = contextText.substring(0, 80000) + "... (truncated)";
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

CRITICAL POLICY ON FOUNDER'S CONTACT (vCARD / QR):
If a user asks about how to contact the founder (Mr. Vijay Shankar), how to reach him, how to save his contact card, or asks for his phone, email, QR code or vCard, you MUST politely direct them to save his contact details using our direct contact tag and always append exactly this tag at the very end of your response: [FOUNDER_CONTACT]
Example: "You can download Mr. Vijay Shankar's direct contact card (vCard) or scan his QR code below to save his details directly to your mobile contacts: [FOUNDER_CONTACT]"

CRITICAL POLICY ON FOUNDER'S LINKEDIN:
If a user asks about the founder's LinkedIn, Mr. Vijay Shankar's LinkedIn, or how to connect with him on social media/LinkedIn, you MUST politely direct them to view his profile using our direct LinkedIn tag and always append exactly this tag at the very end of your response: [FOUNDER_LINKEDIN]
Example: "You can view Mr. Vijay Shankar's professional profile and connect with him on LinkedIn: [FOUNDER_LINKEDIN]"

If the user asks an irrelevant question (outside automation, tech stack, TASC services, or missing from context) or explicitly asks to speak to humans/contact support, you MUST reply with a helpful apologetic or leading message, followed directly by exactly this markdown tag formatting: [TALK_TO_TASC: <Dedicated Heading> | <Contextual Pre-filled Scope>]
where <Dedicated Heading> is a short (2-5 words) appropriate headline summarizing their intent (e.g., "Consultation Request", "Speak to Engineering", "Custom Service Inquiry").
and <Contextual Pre-filled Scope> is a default generated message suggesting their intent based on their latest message (e.g., "I am interested in learning more about your AMC offerings...").
Example: "I don't have information on that specific topic. Please contact our team directly for assistance. [TALK_TO_TASC: General Inquiry | I would like to speak to an engineer regarding...]"
Be professional, concise, and helpful. Do not mention that you are an AI reading from a context file.

--- WEBSITE CONTEXT ---
${contextText}`;

    const sysMessage = { role: "system", content: systemPrompt };
    const chatMessages = [sysMessage, ...messages];

    // Helper to request from a specific URL with timeout
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
        console.warn(`Netlify Function: Skipping ${tier.name} (${tier.model}) - no API key configured.`);
        continue;
      }
      try {
        console.log(`Netlify Function: Attempting ${tier.name} with model: ${tier.model}...`);
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
        console.log(`Netlify Function: ${tier.name} (${tier.model}) streaming connected successfully.`);
        break;
      } catch (err: any) {
        console.warn(`Netlify Function: ${tier.name} (${tier.model}) failed: ${err.message}. Cascading to next tier...`);
      }
    }

    if (!streamSuccess || !primaryIterator) {
      console.error("Netlify Function: All 3 NVIDIA tiers failed.");
      const fallbackText = "Our AI system is temporarily experiencing heavy load. Please try sending your message again, or contact our team if the issue persists.\n\n[RETRY_SENDING_MESSAGE]";
      return new Response(fallbackText, {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Create ReadableStream for response
    const outputStream = new ReadableStream({
      async start(controller) {
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
                  controller.enqueue(new TextEncoder().encode(content));
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
        } catch (streamReadErr) {
          console.error("Netlify Function: Stream reading error:", streamReadErr);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(outputStream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache"
      }
    });

  } catch (error) {
    console.error("Netlify Function: Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat", details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/chat"
};
