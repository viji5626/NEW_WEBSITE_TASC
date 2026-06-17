import { OpenAI } from "openai";
import knowledgeData from "../../website-knowledge.json" assert { type: "json" };

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { messages } = await req.json();
    const apiKey = process.env.NVIDIA_API_KEY || "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";

    const client = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: apiKey,
    });

    let contextText = knowledgeData.context || "";
    if (contextText.length > 200000) {
      contextText = contextText.substring(0, 200000) + "... (truncated)";
    }

    const systemPrompt = `You are the TASC AI Assistant for TASC Automation's website. You help visitors answer questions based strictly on the provided website content context.
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
      extra_body: {
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 1024,
      },
      stream: true,
    });

    // Create a ReadableStream from the async iterable completion
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          if (!chunk.choices || chunk.choices.length === 0) continue;
          const delta = chunk.choices[0].delta as any;
          if (!delta) continue;
          const content = delta.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
