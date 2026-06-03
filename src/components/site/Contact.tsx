import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SectionHeader } from "./Capabilities";
import { scrollToId } from "@/lib/scrollTo";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WEB3FORMS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;

const LINKS = [
  ["Capabilities", "the-arsenal"],
  ["Interoperability", "data-flow-pipeline"],
  ["Industries", "rugged-reliability"],
  ["Case Studies", "case-studies"],
  ["Method", "how-we-build"],
  ["AMC / Support", "amc-model"],
  ["About", "tenacious-by-design"],
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", project_scope: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<boolean | string>(false);

  // Allow other sections (e.g. AMC) to pre-fill the project scope and pull focus.
  useEffect(() => {
    const handler = (e) => {
      const scope = e?.detail?.scope;
      if (typeof scope === "string" && scope.length) {
        setForm((f) => ({ ...f, project_scope: scope }));
        setSubmitted(false);
        // Focus the project_scope textarea after the smooth-scroll settles.
        setTimeout(() => document.getElementById("project_scope")?.focus(), 700);
      }
    };
    window.addEventListener("tasc:prefill-contact", handler);
    return () => window.removeEventListener("tasc:prefill-contact", handler);
  }, []);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.organization || !form.project_scope) {
      toast.error("[ INCOMPLETE PACKET / FILL ALL FIELDS ]");
      return;
    }
    setSubmitting(true);
    
    const ticketId = `TASC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      const payload = {
        name: form.name,
        email: form.email,
        organization: form.organization || "N/A",
        project_scope: form.project_scope,
        subject: `TASC - Form - ${form.organization || form.name}`,
        ticket_id: ticketId
      };

      let response = await fetch("/api/contact/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 404 || response.status === 405) {
        response = await fetch("/.netlify/functions/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

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

  const scrollTo = (id) => () => {
    scrollToId(id);
  };

  return (
    <section
      id="terminal-interface"
      data-testid="section-contact"
      className="relative py-24 md:py-32 border-t border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 11" kicker="TERMINAL INTERFACE" title="Open a secure channel." />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: form */}
          <div className="lg:col-span-8">
            <div className="border border-tasc-border bg-tasc-bg" data-testid="contact-terminal">
              <div className="flex items-center justify-between px-5 py-3 border-b border-tasc-border">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan shadow-[0_0_8px_var(--tasc-glow)] animate-pulse" />
                  <span className="font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-text/60">
                    TASC // TERMINAL · v3.07
                  </span>
                </div>
                <span className="font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-border">[ TLS · ENCRYPTED ]</span>
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
                  <button
                    data-testid="contact-reset"
                    className="mt-8 font-[Orbitron] text-[11px] tracking-[0.25em] border border-tasc-border px-5 py-3 hover:border-tasc-cyan hover:text-tasc-cyan transition-colors text-tasc-text"
                    onClick={() => setSubmitted(false)}
                  >
                    [ SEND ANOTHER ]
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field id="name" label="NAME" value={form.name} onChange={onChange("name")} placeholder="Your name" />
                  <Field id="email" label="EMAIL" type="email" value={form.email} onChange={onChange("email")} placeholder="you@plant.com" />
                  <Field id="organization" label="ORGANIZATION" value={form.organization} onChange={onChange("organization")} placeholder="Company / Plant" wrapper="md:col-span-2" />
                  <FieldArea id="project_scope" label="PROJECT SCOPE" value={form.project_scope} onChange={onChange("project_scope")} placeholder="PLC platform, SCADA scope, EMS goals, brownfield notes…" />

                  <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-border">
                      [ PACKET · {Object.values(form).filter(Boolean).length}/4 FIELDS READY ]
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      data-testid="contact-submit"
                      className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-7 py-4 border border-tasc-border text-tasc-text overflow-hidden hover:border-tasc-cyan hover:bg-tasc-cyan hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <span className="relative">{submitting ? "[ TRANSMITTING… ]" : "[ TRANSMIT DATA ]"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: links / ops */}
          <aside className="lg:col-span-4">
            <div className="border border-tasc-border bg-tasc-bg p-6">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/40 mb-4">
                QUICK LINKS
              </div>
              <ul className="space-y-2">
                {LINKS.map(([t, id]) => (
                  <li key={id}>
                    <button
                      data-testid={`contact-link-${id}`}
                      onClick={scrollTo(id)}
                      className="font-[Orbitron] text-[11px] tracking-[0.25em] text-tasc-text/70 hover:text-tasc-cyan transition-colors"
                    >
                      → {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-px border border-tasc-border bg-tasc-bg p-6 space-y-3">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/40">
                OPERATIONS
              </div>
              {[
                ["DESK", "info@tascautomation.com"],
                ["SUPPORT", "Mon–Sat · 09:00–19:00 IST"],
                ["GRID", "30.371901° N · 78.078037° E"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-tasc-border pb-2 last:border-b-0">
                  <span className="font-[Orbitron] text-[9px] tracking-[0.25em] text-tasc-border">{k}</span>
                  <span className="text-tasc-text/80 text-xs text-right break-all">{v}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, type = "text", value, onChange, placeholder, wrapper = "" }) {
  return (
    <label className={`block ${wrapper}`}>
      <span className="block font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/50 mb-2">
        {label}
      </span>
      <div className="relative group focus-within:ring-1 focus-within:ring-tasc-cyan/30">
        <input
          id={id}
          data-testid={`contact-input-${id}`}
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

function FieldArea({ id, label, value, onChange, placeholder }) {
  return (
    <label className="block md:col-span-2">
      <span className="block font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/50 mb-2">
        {label}
      </span>
      <textarea
        id={id}
        data-testid={`contact-input-${id}`}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        className="w-full bg-transparent border border-tasc-border focus:border-tasc-cyan outline-none p-3 text-tasc-text placeholder:text-tasc-border font-light resize-none focus:ring-1 focus:ring-tasc-cyan/20"
      />
    </label>
  );
}
