import { useEffect, useState } from "react";
import { SectionHeader } from "./Capabilities";
import { Download, X } from "lucide-react";

export default function Founder() {
  const [qrOpen, setQrOpen] = useState(false);

  // Auto-collapse the QR after 10 seconds if the visitor doesn't click again.
  useEffect(() => {
    if (!qrOpen) return;
    const t = setTimeout(() => setQrOpen(false), 10000);
    const onEsc = (e) => e.key === "Escape" && setQrOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onEsc);
    };
  }, [qrOpen]);

  return (
    <section
      id="tenacious-by-design"
      data-testid="section-founder"
      className="relative py-24 md:py-32 border-t border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 09" kicker="ABOUT" title="Tenacious by design." />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Photo column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] bg-tasc-bg border border-tasc-border overflow-hidden">
              <img
                src="/brand/founder-vijay.jpg"
                alt="Mr. Vijay Shankar — Founder, TASC Automation"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%] contrast-[1.05]"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,194,255,0.05) 0%, transparent 35%, transparent 65%, rgba(13,17,23,0.85) 100%)",
                }}
              />
              <div className="absolute inset-0 bp-grid-fine opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-white/80">
                <span>FOUNDER · 10.A</span>
                <span className="text-tasc-cyan">● VERIFIED</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-cyan">
                  MR. VIJAY SHANKAR
                </div>
                <div className="font-[Orbitron] text-[8px] tracking-[0.25em] text-white/70 mt-1">
                  FOUNDER · PRINCIPAL ENGINEER
                </div>
              </div>
              <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-tasc-cyan" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-tasc-cyan" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-tasc-cyan" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-tasc-cyan" />
            </div>
          </div>

          {/* Copy column */}
          <div className="lg:col-span-7">
            <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan">
              MR. VIJAY SHANKAR · FOUNDER
            </div>
            <h3 className="mt-3 font-[Montserrat] text-3xl md:text-4xl font-medium text-tasc-text leading-tight">
              Modern enterprise backed by 11+ years of field experience.
            </h3>

            <p className="mt-6 text-tasc-text/80 text-base md:text-lg font-light leading-relaxed">
              TASC (Tenacious Automation Solutions & Consulting) is a recently established automation and digitalization enterprise. It is driven and guided by a principal mind with over 11+ years of hands-on field experience in industrial automation, digital transformation, and plant-floor operations. 
            </p>
            <p className="mt-5 text-tasc-text/70 text-base md:text-lg font-light leading-relaxed">
              The founder, Mr. Vijay Shankar, established the company to merge agile modern technologies with his deep, decade-plus background in process automation, redundant SCADA/DCS systems, and OT networking. Backed by a team with demanding industrial expertise, TASC delivers robust turnkey engineering, PLC supply, energy management, and web services built to keep plants running and completely future-proofed.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-tasc-border/60 border border-tasc-border">
              {[
                ["Diagnostics first", "Measure before we touch. Comms, ground, scan time, alarms — all on paper before we commit."],
                ["Vendor-neutral", "MELSEC, SIMATIC, ICONICS, ABB — we choose what fits the plant, not the catalogue."],
                ["Documentation discipline", "Drawings, logic, I/O lists and HMI screens stay current. Every revision traceable."],
                ["Long-term support", "We design for the team that runs the plant after we leave. Maintainable, auditable, calm."],
              ].map(([t, b]) => (
                <div key={t} className="bg-tasc-bg p-5">
                  <h4 className="font-[Montserrat] text-base text-tasc-text font-medium">{t}</h4>
                  <p className="mt-2 text-tasc-text/55 text-sm font-light leading-relaxed">{b}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
              <div className="sm:col-span-5 flex items-center gap-3 font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-text/50">
                <span className="w-8 h-px bg-tasc-border" />
                <span>YEARS IN THE FIELD</span>
                <span className="text-tasc-cyan tabular text-base">11+</span>
              </div>

              <div className="sm:col-span-7 flex flex-wrap items-center justify-start sm:justify-end gap-5">
                {/* QR card — click to expand */}
                <button
                  type="button"
                  data-testid="founder-qr"
                  onClick={() => setQrOpen((v) => !v)}
                  className="group relative flex items-center gap-4 border border-tasc-border hover:border-tasc-cyan bg-tasc-bg p-3 transition-colors text-left"
                  aria-label="Click to enlarge QR code"
                >
                  <div className="relative w-24 h-24 bg-white p-1.5 shrink-0">
                    <img
                      src="/brand/vcard-qr.svg"
                      alt="Scan to add contact"
                      loading="lazy"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-cyan">
                      SCAN · vCARD
                    </span>
                    <span className="font-[Montserrat] text-sm text-tasc-text mt-1">
                      Click to enlarge
                    </span>
                    <span className="font-[Orbitron] text-[8px] tracking-[0.25em] text-tasc-text/40 mt-1">
                      Then point your camera →
                    </span>
                  </div>
                </button>

                {/* Download button */}
                <a
                  data-testid="founder-vcard-download"
                  href="/brand/vijay-shankar.vcf"
                  download="Vijay-Shankar-TASC.vcf"
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-6 py-4 border border-tasc-border text-tasc-text overflow-hidden hover:border-tasc-cyan hover:bg-tasc-cyan hover:text-slate-900 transition-all duration-300 inline-flex items-center gap-3"
                >
                  <Download size={14} strokeWidth={1.5} className="relative" />
                  <span className="relative">[ ADD TO CONTACTS ]</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Director section */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Photo column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] bg-tasc-bg border border-tasc-border overflow-hidden">
              <img
                src="/brand/director-monika.jpg"
                alt="Mrs. Monika Chauhan — Director, TASC Automation"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%] contrast-[1.05]"
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop`;
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,194,255,0.05) 0%, transparent 35%, transparent 65%, rgba(13,17,23,0.85) 100%)",
                }}
              />
              <div className="absolute inset-0 bp-grid-fine opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-white/80">
                <span>DIRECTOR · 10.B</span>
                <span className="text-tasc-cyan">● VERIFIED</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-cyan">
                  MRS. MONIKA CHAUHAN
                </div>
                <div className="font-[Orbitron] text-[8px] tracking-[0.25em] text-white/70 mt-1">
                  DIRECTOR
                </div>
              </div>
              <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-tasc-cyan" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-tasc-cyan" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-tasc-cyan" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-tasc-cyan" />
            </div>
          </div>

          {/* Copy column */}
          <div className="lg:col-span-7">
            <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan">
              MRS. MONIKA CHAUHAN · DIRECTOR
            </div>
            <h3 className="mt-3 font-[Montserrat] text-3xl md:text-4xl font-medium text-tasc-text leading-tight">
              Empowering people and driving strategic management.
            </h3>

            <p className="mt-6 text-tasc-text/80 text-base md:text-lg font-light leading-relaxed">
              With extensive experience in Human Resources and strategic management,
              the Director plays a pivotal role in shaping the organizational culture and human 
              capital strategies at TASC (Tenacious Automation Solutions & Consulting). Her focus rests on talent acquisition, 
              employee development, and fostering an inclusive, high-performance workplace where 
              cross-functional engineering teams can thrive and innovate.
            </p>
            <p className="mt-5 text-tasc-text/70 text-base md:text-lg font-light leading-relaxed">
              Guided by a commitment to organizational excellence, she spearheads performance 
              management and continuous learning initiatives. Her structured approach ensures that 
              TASC (Tenacious Automation Solutions & Consulting) recruits top-tier industrial automation talent while maintaining high employee 
              engagement, aligning human resource objectives directly with the company's long-term 
              business goals.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-tasc-border/60 border border-tasc-border">
              {[
                ["Talent Acquisition", "Strategically sourcing and recruiting top-tier engineering professionals to drive industrial innovation."],
                ["Organizational Development", "Fostering a collaborative culture and optimizing team structures for sustainable business growth."],
                ["Performance Management", "Implementing structured evaluation frameworks to recognize achievements and mentor emerging leaders."],
                ["Employee Engagement", "Championing workplace well-being, resolving HR matters, and building a highly motivated workforce."],
              ].map(([t, b]) => (
                <div key={t} className="bg-tasc-bg p-5">
                  <h4 className="font-[Montserrat] text-base text-tasc-text font-medium">{t}</h4>
                  <p className="mt-2 text-tasc-text/55 text-sm font-light leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged QR overlay */}
      {qrOpen && (
        <div
          data-testid="founder-qr-overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-tasc-bg/85 backdrop-blur-md p-6"
          onClick={() => setQrOpen(false)}
        >
          <div
            className="relative bg-white p-5 md:p-7"
            style={{ width: "min(80vw, 80vh, 460px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/brand/vcard-qr.svg"
              alt="Scan with your phone camera"
              loading="lazy"
              className="w-full h-auto block"
              draggable={false}
            />
            <button
              type="button"
              data-testid="founder-qr-close"
              onClick={() => setQrOpen(false)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-tasc-bg border border-tasc-cyan text-tasc-cyan flex items-center justify-center hover:bg-tasc-cyan hover:text-slate-900 transition-colors"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            {/* Corner ticks for the industrial frame feel */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-tasc-cyan" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-tasc-cyan" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-tasc-cyan" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-tasc-cyan" />
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/70">
            POINT YOUR PHONE CAMERA · CLICK TO CLOSE · AUTO-CLOSES IN 10 s
          </div>
        </div>
      )}
    </section>
  );
}
