import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [headline, setHeadline] = useState("Open a secure channel.");
  const [form, setForm] = useState({ name: "", email: "", organization: "", project_scope: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<boolean | string>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  useEffect(() => {
    const handler = (e: any) => {
      const { headline: newHeadline, scope } = e?.detail || {};
      setHeadline(newHeadline || "Open a secure channel.");
      if (typeof scope === "string" && scope.length) {
        setForm((f) => ({ ...f, project_scope: scope }));
      }
      setSubmitted(false);
      setIsOpen(true);
      setTimeout(() => document.getElementById("modal_project_scope")?.focus(), 100);
    };
    window.addEventListener("tasc:open-contact-modal", handler);
    return () => window.removeEventListener("tasc:open-contact-modal", handler);
  }, []);

  // Lock scroll of body and custom Lenis smooth scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.stop();
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        if (lenis) {
          lenis.start();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onChange = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const buildMailto = (data = form, reqId = "") => {
    const subject = `[${reqId || "TASC-REQ"}] New Request — ${data.organization || "Inquiry"}`;
    const body = [
      `OFFICIAL REQUEST ID: ${reqId}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organization: ${data.organization}`,
      "",
      "Project Scope / Requirements:",
      data.project_scope,
      "",
      "---------------------------------------------",
      "Notice: Download link will be shared to this email address soon after our engineering team reviews the request."
    ].join("\n");
    return `mailto:info@tascautomation.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.organization || !form.project_scope) {
      toast.error("[ INCOMPLETE PACKET / FILL ALL FIELDS ]");
      return;
    }

    setSubmitting(true);
    
    const reqId = `TASC-REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const userEmail = form.email;
    setSubmittedEmail(userEmail);

    try {
      const formData = new FormData();
      formData.append("access_key", "cc7c2810-6da6-4d9b-b2cc-f3ebc28759d0");
      formData.append("subject", `[${reqId}] TASC Request - ${form.organization || form.name}`);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("organization", form.organization || "N/A");
      formData.append("request_id", reqId);
      formData.append("ticket_id", reqId);
      formData.append("project_scope", `OFFICIAL REQUEST ID: ${reqId}\n\n${form.project_scope}\n\n[Note: Download link will be shared to ${userEmail} following engineering review]`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Email submission failed");
      }

      setSubmitted(reqId);
      toast.success(`[ TRANSMISSION ACKNOWLEDGED · REQ: ${reqId} ]`);
      setForm({ name: "", email: "", organization: "", project_scope: "" });
    } catch (err) {
      console.error(err);
      toast.success(`[ TRANSMITTING VIA EMAIL CLIENT · REQ: ${reqId} ]`);
      try {
        window.location.href = buildMailto(form, reqId);
      } catch (_) {
        /* noop */
      }
      setSubmitted(reqId);
      setForm({ name: "", email: "", organization: "", project_scope: "" });
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setIsOpen(false);
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#0a0a0b]/40 backdrop-blur-lg transition-all duration-300">
      <div 
        className="w-full max-w-3xl bg-tasc-bg border border-tasc-border shadow-2xl relative z-[99999]"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-tasc-border bg-slate-100 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan shadow-[0_0_8px_var(--tasc-glow)] animate-pulse" />
              <span className="font-[Orbitron] text-[10px] max-w-[200px] md:max-w-none truncate tracking-[0.25em] text-tasc-text/60 uppercase">
                {headline}
              </span>
            </div>
            <button 
              onClick={close}
              className="text-tasc-text/50 hover:text-tasc-cyan transition-colors"
            >
              <X size={16} />
            </button>
        </div>

        {submitted ? (
          <div className="p-6 md:p-10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-tasc-border">
              <div className="font-[Orbitron] text-xs tracking-[0.25em] text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                <span>[ TRANSMISSION ACKNOWLEDGED · REQUEST LOGGED ]</span>
              </div>
              <span className="font-[Orbitron] text-[10px] text-tasc-text/50">200 OK</span>
            </div>

            {/* Request ID Display Card */}
            <div className="p-5 border border-tasc-cyan/40 bg-tasc-cyan/5">
              <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-cyan uppercase mb-1">
                Official Request Tracking Identifier
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-tasc-text select-all">
                  {typeof submitted === "string" ? submitted : "TASC-REQ-CONFIRMED"}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof submitted === "string") {
                      navigator.clipboard.writeText(submitted);
                      toast.success("[ REQUEST ID COPIED TO CLIPBOARD ]");
                    }
                  }}
                  className="font-[Orbitron] text-[10px] tracking-wider px-3.5 py-1.5 border border-tasc-cyan/50 text-tasc-cyan hover:bg-tasc-cyan hover:text-slate-900 transition-colors uppercase font-semibold"
                >
                  Copy Request ID
                </button>
              </div>
            </div>

            {/* Explanatory Message */}
            <div className="space-y-3">
              <h3 className="font-[Montserrat] text-xl sm:text-2xl font-medium text-tasc-text">
                Your request has been registered with our engineering desk.
              </h3>
              <div className="p-4 border border-tasc-border bg-slate-50 dark:bg-slate-950/60 space-y-3 text-xs sm:text-sm text-tasc-text/80 font-light leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Dispatched with Email:</strong> This exact Request ID <strong className="text-tasc-cyan font-mono">({typeof submitted === "string" ? submitted : ""})</strong> has been attached to your dispatch transmission to our engineering team and recorded in our system.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-tasc-cyan font-bold">●</span>
                  <span><strong>Download Link Delivery:</strong> The secure software installer download link will be shared with you soon after our engineering team reviews your plant and driver specifications at <strong className="text-tasc-text font-mono">{submittedEmail || "your email address"}</strong>.</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-tasc-border">
              <button
                className="font-[Orbitron] text-[11px] tracking-[0.2em] border border-tasc-border px-6 py-3 hover:border-tasc-cyan hover:text-tasc-cyan transition-colors text-tasc-text"
                onClick={() => setSubmitted(false)}
              >
                [ SUBMIT ANOTHER INQUIRY ]
              </button>
              <button
                className="font-[Orbitron] text-[11px] tracking-[0.2em] bg-tasc-cyan text-slate-900 border border-tasc-cyan px-6 py-3 font-semibold hover:bg-tasc-cyan/80 transition-colors"
                onClick={close}
              >
                [ CLOSE CONFIRMATION ]
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field id="modal_name" label="NAME" value={form.name} onChange={onChange("name")} placeholder="Your name" />
            <Field id="modal_email" label="EMAIL" type="email" value={form.email} onChange={onChange("email")} placeholder="you@plant.com" />
            <Field id="modal_organization" label="ORGANIZATION" value={form.organization} onChange={onChange("organization")} placeholder="Company / Plant" wrapper="md:col-span-2" />
            <FieldArea id="modal_project_scope" label="PROJECT SCOPE" value={form.project_scope} onChange={onChange("project_scope")} placeholder="Details regarding your inquiry..." />

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-border">
                [ PACKET · {Object.values(form).filter(Boolean).length}/4 FIELDS READY ]
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-7 py-4 border border-tasc-border text-tasc-text overflow-hidden hover:border-tasc-cyan hover:bg-tasc-cyan hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <span className="relative">{submitting ? "[ TRANSMITTING… ]" : "[ TRANSMIT DATA ]"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

function Field({ id, label, type = "text", value, onChange, placeholder, wrapper = "" }: any) {
  return (
    <label className={`block ${wrapper}`}>
      <span className="block font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/50 mb-2">
        {label}
      </span>
      <div className="relative group focus-within:ring-1 focus-within:ring-tasc-cyan/30">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-transparent border-b border-tasc-border focus:border-tasc-cyan outline-none py-3 text-tasc-text placeholder:text-tasc-border font-light"
        />
        <span className="absolute right-0 bottom-3 font-[Orbitron] text-[10px] text-tasc-border group-focus-within:text-tasc-cyan">
          █
        </span>
      </div>
    </label>
  );
}

function FieldArea({ id, label, value, onChange, placeholder }: any) {
  return (
    <label className="block md:col-span-2">
      <span className="block font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/50 mb-2">
        {label}
      </span>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        className="w-full bg-transparent border border-tasc-border focus:border-tasc-cyan outline-none p-3 text-tasc-text placeholder:text-tasc-border font-light resize-none focus:ring-1 focus:ring-tasc-cyan/20"
      />
    </label>
  );
}
