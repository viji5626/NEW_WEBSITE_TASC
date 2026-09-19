import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, organization, project_scope, subject, from_name, replyto } = body;

    const packetId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Fallback key matches what was in server.ts
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY || process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || "cc7c2810-6da6-4d9b-b2cc-f3ebc28759d0";

    const payload: Record<string, any> = {
      access_key: accessKey,
      name,
      email,
      subject: subject || `[TASC] New Consultation — ${organization || name}`,
      from_name: from_name || `TASC Website · ${name}`,
      replyto: replyto || email,
      Organization: organization || "N/A",
      "Project Scope": project_scope,
      "Packet ID": packetId
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      return new Response(JSON.stringify({ success: true, packetId, message: "Email sent successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: data.message || "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Web3Forms proxy error:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/contact/email"
};
