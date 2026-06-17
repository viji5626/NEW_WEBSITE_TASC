import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SectionHeader } from "./Capabilities";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WEB3FORMS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;

const LINKS = [
  ["Capabilities", "the-arsenal"],
  ["Interoperability", "data-flow-pipeline"],
  ["Dashboards", "proof-of-visibility"],
  ["Industries", "rugged-reliability"],
  ["Case Studies", "case-studies"],
  ["Method", "how-we-build"],
  ["AMC / Support", "amc-model"],
  ["About", "tenacious-by-design"],
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", project_scope: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    // Run Web3Forms (email delivery) and MongoDB persistence in parallel.
    // Use FormData (NOT JSON) so the request is a CORS-simple POST and skips
    // the preflight OPTIONS step. For real residential-IP visitors Web3Forms
    // will respond 200 + {success:true}. If the visitor's network triggers
    // Web3Forms' Cloudflare bot challenge, the request fails silently — in
    // that case we fall back to a mailto: link so the email still gets out.
    const snapshot = { ...form };
    let web3Promise;
    if (WEB3FORMS_KEY) {
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_KEY);
      fd.append("subject", `[TASC] New Consultation — ${form.organization}`);
      fd.append("from_name", `TASC Website · ${form.name}`);
      fd.append("replyto", form.email);
      fd.append("Name", form.name);
      fd.append("Email", form.email);
      fd.append("Organization", form.organization);
      fd.append("Project Scope", form.project_scope);
      web3Promise = fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      })
        .then((r) => r.json())
        .catch((err) => ({ success: false, error: err?.message }));
    } else {
      web3Promise = Promise.resolve({ success: false, skipped: true });
    }

    // MongoDB persistence is best-effort. On static hosts (Netlify, Vercel,
    // GitHub Pages, etc.) there is no FastAPI backend, so /api/contact will
    // 404. That's fine — we still want the email to go out via Web3Forms or
    // the mailto: fallback, so we never surface a 4xx from this channel.
    const mongoPromise = axios
      .post(`${API}/contact`, form, { timeout: 5000 })
      .then(() => ({ success: true }))
      .catch((err) => ({ success: false, error: err?.response?.data?.detail || err?.message }));

    try {
      const [web3, _mongo] = await Promise.all([web3Promise, mongoPromise]);
      if (web3.success) {
        setSubmitted(true);
        toast.success("[ TRANSMISSION ACKNOWLEDGED ]");
        setForm({ name: "", email: "", organization: "", project_scope: "" });
      } else {
        // Web3Forms didn't deliver — open the user's email client as a
        // guaranteed fallback. The MongoDB result is intentionally ignored;
        // it would only confuse the visitor on static hosts.
        setSubmitted(true);
        toast.success("[ TRANSMITTING VIA EMAIL CLIENT ]");
        try {
          window.location.href = buildMailto(snapshot);
        } catch (_) {
          /* noop */
        }
        setForm({ name: "", email: "", organization: "", project_scope: "" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const scrollTo = (id) => () => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
  };

  return (
    <section
      id="terminal-interface"
      data-testid="section-contact"
      className="relative py-24 md:py-32 border-t border-[#2B313A]"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 10" kicker="TERMINAL INTERFACE" title="Open a secure channel." />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: form */}
          <div className="lg:col-span-8">
            <div className="border border-[#2B313A] bg-[#0D1117]" data-testid="contact-terminal">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#2B313A]">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] shadow-[0_0_8px_#00C2FF] animate-pulse" />
                  <span className="font-[Orbitron] text-[10px] tracking-[0.25em] text-[#E6EDF3]/60">
                    TASC // TERMINAL · v3.07
                  </span>
                </div>
                <span className="font-[Orbitron] text-[10px] tracking-[0.25em] text-[#2B313A]">[ TLS · ENCRYPTED ]</span>
              </div>

              {submitted ? (
                <div className="p-10">
                  <div className="font-[Orbitron] text-xs tracking-[0.3em] text-[#00C2FF] mb-4">
                    [ ACK · 200 OK ]
                  </div>
                  <h3 className="font-[Montserrat] text-2xl text-[#E6EDF3]">Transmission received.</h3>
                  <p className="mt-3 text-[#E6EDF3]/60 text-sm font-light max-w-md leading-relaxed">
                    A TASC engineer will respond within one business day. For urgent operations,
                    reference your packet ID in the follow-up.
                  </p>
                  <button
                    data-testid="contact-reset"
                    className="mt-8 font-[Orbitron] text-[11px] tracking-[0.25em] border border-[#2B313A] px-5 py-3 hover:border-[#00C2FF] hover:text-[#00C2FF] transition-colors text-[#E6EDF3]"
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
                    <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-[#2B313A]">
                      [ PACKET · {Object.values(form).filter(Boolean).length}/4 FIELDS READY ]
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      data-testid="contact-submit"
                      className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-7 py-4 border border-[#2B313A] text-[#E6EDF3] overflow-hidden hover:border-[#00C2FF] hover:text-[#0D1117] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="absolute inset-0 bg-[#00C2FF] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]" />
                      <span className="relative">{submitting ? "[ TRANSMITTING… ]" : "[ TRANSMIT DATA ]"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: links / ops */}
          <aside className="lg:col-span-4">
            <div className="border border-[#2B313A] bg-[#0D1117] p-6">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#E6EDF3]/40 mb-4">
                QUICK LINKS
              </div>
              <ul className="space-y-2">
                {LINKS.map(([t, id]) => (
                  <li key={id}>
                    <button
                      data-testid={`contact-link-${id}`}
                      onClick={scrollTo(id)}
                      className="font-[Orbitron] text-[11px] tracking-[0.25em] text-[#E6EDF3]/70 hover:text-[#00C2FF] transition-colors"
                    >
                      → {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-px border border-[#2B313A] bg-[#0D1117] p-6 space-y-3">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#E6EDF3]/40">
                OPERATIONS
              </div>
              {[
                ["DESK", "info@tascautomation.com"],
                ["SUPPORT", "Mon–Sat · 09:00–19:00 IST"],
                ["GRID", "12.97° N · 77.59° E"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-[#2B313A] pb-2 last:border-b-0">
                  <span className="font-[Orbitron] text-[9px] tracking-[0.25em] text-[#2B313A]">{k}</span>
                  <span className="text-[#E6EDF3]/80 text-xs text-right break-all">{v}</span>
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
      <span className="block font-[Orbitron] text-[10px] tracking-[0.3em] text-[#E6EDF3]/50 mb-2">
        {label}
      </span>
      <div className="relative group focus-within:ring-1 focus-within:ring-[#00C2FF]/30">
        <input
          id={id}
          data-testid={`contact-input-${id}`}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-transparent border-b border-[#2B313A] focus:border-[#00C2FF] outline-none py-3 text-[#E6EDF3] placeholder:text-[#2B313A] font-light"
        />
        <span className="absolute right-0 bottom-3 font-[Orbitron] text-[10px] text-[#2B313A] group-focus-within:text-[#00C2FF]">
          █
        </span>
      </div>
    </label>
  );
}

function FieldArea({ id, label, value, onChange, placeholder }) {
  return (
    <label className="block md:col-span-2">
      <span className="block font-[Orbitron] text-[10px] tracking-[0.3em] text-[#E6EDF3]/50 mb-2">
        {label}
      </span>
      <textarea
        id={id}
        data-testid={`contact-input-${id}`}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        className="w-full bg-transparent border border-[#2B313A] focus:border-[#00C2FF] outline-none p-3 text-[#E6EDF3] placeholder:text-[#2B313A] font-light resize-none focus:ring-1 focus:ring-[#00C2FF]/20"
      />
    </label>
  );
}
