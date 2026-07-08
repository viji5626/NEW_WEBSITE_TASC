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

function getAuthorizedResponse(): string {
  return "Nowhere we have mentioned that we are authorized to any of the make. However we have expertise in brand and we worked with it.";
}

function getImprovisedEstdResponse(): string {
  return "You can contact to our team for this Estd. information. However Founder have decade+ experience in industrial automation field. [TALK_TO_TASC: Estd. Information Request | Please contact us for detailed company establishment history]";
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

    // Intercept any questions about authorization
    if (isAuthorizedQuestion(userMsg)) {
      return new Response(getAuthorizedResponse(), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Intercept any questions about company age or establishment date
    if (isEstdQuestion(userMsg)) {
      return new Response(getImprovisedEstdResponse(), {
        headers: { "Content-Type": "text/plain" }
      });
    }

    const primaryKey = process.env.NVIDIA_PRIMARY_API_KEY || process.env.NVIDIA_API_KEY || "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";
    const standbyKey = process.env.NVIDIA_STANDBY_API_KEY || "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";

    let contextText = knowledgeData.context || "";
    if (contextText.length > 200000) {
      contextText = contextText.substring(0, 200000) + "... (truncated)";
    }

    const systemPrompt = `You are the TASC AI Assistant for TASC Automation's website. You help visitors answer questions based strictly on the provided website content context.

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

    let response: Response | null = null;
    let usedStandby = false;

    // Try primary
    try {
      console.log("Netlify Function: Trying primary model nvidia/nemotron-3-nano-30b-a3b...");
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
      console.warn(`Netlify Function: Primary API failed or delayed (${primaryErr.message}). Switching to standby...`);
      usedStandby = true;
    }

    // Validate streaming of first token from primary
    let primaryIterator: any = null;
    let firstResult: any = null;
    if (response && !usedStandby) {
      try {
        primaryIterator = getStreamIterator(response);
        firstResult = await withTimeout(primaryIterator.next(), 6000, "First token timeout");
        console.log("Netlify Function: Primary API streaming started.");
      } catch (streamErr: any) {
        console.warn(`Netlify Function: Primary stream failed or delayed (${streamErr.message}). Falling back to standby...`);
        usedStandby = true;
      }
    }

    // Try standby if primary failed/delayed
    if (usedStandby) {
      try {
        console.log("Netlify Function: Trying standby model google/diffusiongemma-26b-a4b-it...");
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
        console.log("Netlify Function: Standby API streaming started.");
      } catch (standbyErr: any) {
        console.error("Netlify Function: Both primary and standby APIs failed:", standbyErr);
        const fallbackText = "Our AI system is temporarily experiencing heavy load. Please try sending your message again, or contact our team if the issue persists.\n\n[RETRY_SENDING_MESSAGE]";
        return new Response(fallbackText, {
          headers: { "Content-Type": "text/plain" }
        });
      }
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
