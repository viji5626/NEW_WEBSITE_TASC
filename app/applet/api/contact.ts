export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, organization, project_scope, subject, from_name, replyto } = req.body;
    const packetId = Math.floor(100000 + Math.random() * 900000).toString();
    
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY || process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || "cc7c2810-6da6-4d9b-b2cc-f3ebc28759d0";
    
    const payload = {
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
      res.status(200).json({ success: true, packetId, message: "Email sent successfully" });
    } else {
      res.status(500).json({ success: false, message: data.message || "Failed to send email" });
    }
  } catch (error: any) {
    console.error("Web3Forms proxy error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
