const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();

const primaryKey = process.env.NVIDIA_PRIMARY_API_KEY || process.env.NVIDIA_API_KEY || "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";
const standbyKey = process.env.NVIDIA_STANDBY_API_KEY || "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";

async function* getStreamIterator(response) {
  const body = response.body;
  if (!body) return;
  const reader = body.getReader();
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
}

async function testTiming(model, apiKey, name) {
  console.log(`\n--- Testing ${name} (${model}) ---`);
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

  const payload = {
    model: model,
    messages: chatMessages,
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 4096,
    stream: true
  };
  if (model.includes("nemotron")) {
    payload.reasoning_budget = 4096;
  } else if (model.includes("diffusiongemma")) {
    payload.chat_template_kwargs = { enable_thinking: true };
  }

  const startTime = Date.now();
  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
      },
      body: JSON.stringify(payload)
    });
    const connectTime = Date.now() - startTime;
    console.log(`Connection established in ${connectTime}ms. Status: ${res.status}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const iterator = getStreamIterator(res);
    const firstTokenStartTime = Date.now();
    const firstResult = await iterator.next();
    const firstTokenTime = Date.now() - firstTokenStartTime;
    console.log(`First chunk received in ${firstTokenTime}ms.`);
    console.log(`First chunk value snippet: ${firstResult.value ? firstResult.value.substring(0, 150) : "empty"}`);
  } catch (err) {
    console.error(`${name} failed:`, err.message);
  }
}

async function main() {
  await testTiming("nvidia/nemotron-3-nano-30b-a3b", primaryKey, "Primary");
  await testTiming("google/diffusiongemma-26b-a4b-it", standbyKey, "Standby");
}

main();
