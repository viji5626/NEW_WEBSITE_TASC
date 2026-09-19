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

  const buildMailto = (data = form) => {
    const subject = `[TASC] New Consultation — ${data.organization || "Inquiry"}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organization: ${data.organization}`,
      "",
      "Project Scope:",
      data.project_scope,
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
    
    const ticketId = `TASC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      const formData = new FormData();
      formData.append("access_key", "cc7c2810-6da6-4d9b-b2cc-f3ebc28759d0");
      formData.append("subject", `TASC - Form - ${form.organization || form.name}`);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("organization", form.organization || "N/A");
      formData.append("project_scope", form.project_scope);
      formData.append("ticket_id", ticketId);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Email submission failed");
      }

      setSubmitted(ticketId);
      toast.success("[ TRANSMISSION ACKNOWLEDGED ]");
      setForm({ name: "", email: "", organization: "", project_scope: "" });
    } catch (err) {
      console.error(err);
      toast.success("[ TRANSMITTING VIA EMAIL CLIENT ]");
      try {
        window.location.href = buildMailto(form);
      } catch (_) {
        /* noop */
      }
      setSubmitted(ticketId);
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#0a0a0b]/35 backdrop-blur-lg transition-all duration-300">
      <div 
        className="w-full max-w-3xl bg-tasc-bg border border-tasc-border shadow-2xl relative z-[99999]"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-tasc-border">
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
          <div className="p-10">
            <div className="font-[Orbitron] text-xs tracking-[0.3em] text-tasc-cyan mb-4">
              [ ACK · 200 OK ]
            </div>
            <h3 className="font-[Montserrat] text-2xl text-tasc-text">Transmission received.</h3>
            <p className="mt-3 text-tasc-text/60 text-sm font-light max-w-md leading-relaxed">
              A TASC engineer will respond within one business day. For urgent operations,
              reference your packet ID <strong className="text-tasc-cyan">{typeof submitted === "string" ? `#${submitted}` : "in the follow-up"}</strong>.
            </p>
            <div className="flex gap-4 mt-8">
              <button
                className="font-[Orbitron] text-[11px] tracking-[0.25em] border border-tasc-border px-5 py-3 hover:border-tasc-cyan hover:text-tasc-cyan transition-colors text-tasc-text"
                onClick={() => setSubmitted(false)}
              >
                [ SEND ANOTHER ]
              </button>
              <button
                className="font-[Orbitron] text-[11px] tracking-[0.25em] bg-tasc-cyan text-slate-900 border border-tasc-cyan px-5 py-3 hover:bg-transparent hover:text-tasc-cyan transition-colors"
                onClick={close}
              >
                [ CLOSE TERMINAL ]
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
