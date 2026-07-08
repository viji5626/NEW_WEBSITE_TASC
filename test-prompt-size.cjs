const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();

const primaryKey = process.env.NVIDIA_PRIMARY_API_KEY || process.env.NVIDIA_API_KEY || "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";
const standbyKey = process.env.NVIDIA_STANDBY_API_KEY || "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";

const withTimeout = async (promise, ms, errorMessage) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

async function run() {
  const knowledgeData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "website-knowledge.json"), "utf-8"));
  let contextText = knowledgeData.context;
  if (contextText.length > 200000) {
    contextText = contextText.substring(0, 200000) + "... (truncated)";
  }

  const systemPrompt = `You are the TASC AI Assistant... --- WEBSITE CONTEXT --- \n${contextText}`;
  const chatMessages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: "What are your core capabilities?" }
  ];

  console.log("Context text length:", contextText.length, "characters");
  console.log("Total system prompt length:", systemPrompt.length, "characters");

  const primaryPayload = {
    model: "nvidia/nemotron-3-nano-30b-a3b",
    messages: chatMessages,
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 4096,
    reasoning_budget: 4096,
    stream: true
  };

  try {
    console.log("Testing primary with full context...");
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${primaryKey}`,
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
      },
      body: JSON.stringify(primaryPayload)
    });
    console.log("Primary API status:", res.status);
    const text = await res.text();
    console.log("Primary response snippet (first 500 chars):", text.substring(0, 500));
  } catch (err) {
    console.error("Primary failed:", err.message);
  }

  const standbyPayload = {
    model: "google/diffusiongemma-26b-a4b-it",
    messages: chatMessages,
    max_tokens: 4096,
    temperature: 1.0,
    top_p: 0.95,
    stream: true,
    chat_template_kwargs: { enable_thinking: true }
  };

  try {
    console.log("\nTesting standby with full context...");
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${standbyKey}`,
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
      },
      body: JSON.stringify(standbyPayload)
    });
    console.log("Standby API status:", res.status);
    const text = await res.text();
    console.log("Standby response snippet (first 500 chars):", text.substring(0, 500));
  } catch (err) {
    console.error("Standby failed:", err.message);
  }
}

run();
