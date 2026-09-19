import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const token = body["cf-turnstile-response"] || body.token || body.turnstileToken;
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "Token missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const secretKey =
      process.env.TURNSTILE_SECRET ||
      "1x0000000000000000000000000000000AA";
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const clientIp = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for");
    if (clientIp) {
      formData.append("remoteip", clientIp);
    }

    const cfResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData
    });

    const data = await cfResp.json();
    if (data.success) {
      return new Response(JSON.stringify({ success: true, message: "Turnstile verified" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: "Turnstile validation failed", errors: data["error-codes"] }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/turnstile/verify"
};
