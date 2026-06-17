const { OpenAI } = require("openai");

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: "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",
});

async function main() {
  try {
    const res = await client.chat.completions.create({
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
      messages: [{role: "user", content: "Hi"}],
      max_tokens: 10
    });
    console.log("Success:", res.choices[0].message.content);
  } catch(e) {
    console.error("Error:", e.message);
  }
}
main();
