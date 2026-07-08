const dotenv = require("dotenv");
dotenv.config();

const primaryKey = process.env.NVIDIA_PRIMARY_API_KEY || process.env.NVIDIA_API_KEY || "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";
const standbyKey = process.env.NVIDIA_STANDBY_API_KEY || "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";

async function testNvidia(apiKey, model) {
  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 50
      })
    });
    console.log(`Model: ${model}`);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response snippet: ${text.substring(0, 300)}`);
  } catch (err) {
    console.error(`Error with ${model}:`, err.message);
  }
}

async function main() {
  console.log("Testing keys...");
  await testNvidia(primaryKey, "nvidia/nemotron-3-nano-30b-a3b");
  await testNvidia(standbyKey, "google/diffusiongemma-26b-a4b-it");
  await testNvidia(primaryKey, "meta/llama-3.1-8b-instruct"); // let's try a standard model too
  await testNvidia(standbyKey, "meta/llama-3.1-8b-instruct");
}

main();
