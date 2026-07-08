const dotenv = require("dotenv");
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

async function* getStreamIterator(response) {
  const body = response.body;
  if (!body) return;

  if (typeof body.getReader === "function") {
    console.log("getStreamIterator: using getReader()");
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
  } else if (typeof body.on === "function") {
    console.log("getStreamIterator: using body.on (node-fetch style)");
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    for await (const chunk of body) {
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
  } else if (body[Symbol.asyncIterator]) {
    console.log("getStreamIterator: using asyncIterator directly on body");
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    for await (const chunk of body) {
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
  } else {
    console.log("getStreamIterator: body has no reader, on, or asyncIterator!", Object.getOwnPropertyNames(body));
  }
}

const fetchWithTimeout = async (url, payload, apiKey, timeoutMs) => {
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

async function run() {
  console.log("Simulating primary model call...");
  const chatMessages = [{ role: "user", content: "Hi" }];
  const primaryPayload = {
    model: "nvidia/nemotron-3-nano-30b-a3b",
    messages: chatMessages,
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 4096,
    reasoning_budget: 4096,
    stream: true
  };

  let response = null;
  let usedStandby = false;

  try {
    response = await fetchWithTimeout("https://integrate.api.nvidia.com/v1/chat/completions", primaryPayload, primaryKey, 2500);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    console.log("Primary API connection succeeded!");
  } catch (err) {
    console.error("Primary API connection failed:", err.message);
    usedStandby = true;
  }

  let primaryIterator = null;
  let firstResult = null;
  if (response && !usedStandby) {
    try {
      primaryIterator = getStreamIterator(response);
      firstResult = await withTimeout(primaryIterator.next(), 2000, "First token timeout");
      console.log("Primary API streaming started successfully!");
    } catch (err) {
      console.error("Primary API streaming failed or timed out:", err.message);
      usedStandby = true;
    }
  }

  if (usedStandby) {
    console.log("Simulating standby model call...");
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
      response = await fetchWithTimeout("https://integrate.api.nvidia.com/v1/chat/completions", standbyPayload, standbyKey, 4000);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      primaryIterator = getStreamIterator(response);
      firstResult = await withTimeout(primaryIterator.next(), 3000, "First token timeout");
      console.log("Standby API streaming started successfully!");
    } catch (err) {
      console.error("Standby API streaming failed too:", err.message);
    }
  }

  // Consume and print the stream
  if (primaryIterator && firstResult) {
    const processLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed === "data: [DONE]") return;
      if (trimmed.startsWith("data: ")) {
        try {
          const jsonStr = trimmed.slice(6);
          const data = JSON.parse(jsonStr);
          const content = data.choices?.[0]?.delta?.content || "";
          if (content) {
            process.stdout.write(content);
          }
        } catch (e) {
          // ignore
        }
      }
    };

    if (firstResult && !firstResult.done) {
      processLine(firstResult.value);
    }

    try {
      while (true) {
        const { value, done } = await primaryIterator.next();
        if (done) break;
        processLine(value);
      }
      console.log("\nStream finished successfully!");
    } catch (err) {
      console.error("\nError reading remaining stream:", err.message);
    }
  }
}

run();
