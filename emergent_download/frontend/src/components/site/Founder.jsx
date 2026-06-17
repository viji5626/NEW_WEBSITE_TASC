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
      className="relative py-24 md:py-32 border-t border-[#2B313A]"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 09" kicker="ABOUT" title="Tenacious by design." />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Photo column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] bg-[#0D1117] border border-[#2B313A] overflow-hidden">
              <img
                src="/brand/founder-vijay.jpg"
                alt="Mr. Vijay Shankar — Founder, TASC Automation"
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
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-[#E6EDF3]/80">
                <span>FOUNDER · 07.A</span>
                <span className="text-[#00C2FF]">● VERIFIED</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-[#00C2FF]">
                  MR. VIJAY SHANKAR
                </div>
                <div className="font-[Orbitron] text-[8px] tracking-[0.25em] text-[#E6EDF3]/70 mt-1">
                  FOUNDER · PRINCIPAL ENGINEER
                </div>
              </div>
              <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#00C2FF]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#00C2FF]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#00C2FF]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#00C2FF]" />
            </div>
          </div>

          {/* Copy column */}
          <div className="lg:col-span-7">
            <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#00C2FF]">
              MR. VIJAY SHANKAR · FOUNDER
            </div>
            <h3 className="mt-3 font-[Montserrat] text-3xl md:text-4xl font-medium text-[#E6EDF3] leading-tight">
              A decade-plus of industrial automation expertise.
            </h3>

            <p className="mt-6 text-[#E6EDF3]/80 text-base md:text-lg font-light leading-relaxed">
              With 11+ years of experience in industrial automation and digital transformation,
              the founder has led the execution of advanced Process Automation, SCADA, DCS and
              Factory Automation solutions across multiple industrial domains. The expertise spans
              PLCs, HMIs, VFDs, Industrial IoT and Industry 4.0 integration — enabling
              organizations to achieve real-time monitoring, intelligent control and data-driven
              operational excellence.
            </p>
            <p className="mt-5 text-[#E6EDF3]/70 text-base md:text-lg font-light leading-relaxed">
              Driven by a strong vision for innovation and reliability, the founder established
              TASC to deliver scalable turnkey automation and digitalization solutions tailored
              to modern industrial challenges. With deep technical expertise in process industries,
              manufacturing, utilities and infrastructure, the company focuses on building
              high-performance systems that improve productivity, efficiency, reliability and
              long-term operational sustainability.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#2B313A]/60 border border-[#2B313A]">
              {[
                ["Diagnostics first", "Measure before we touch. Comms, ground, scan time, alarms — all on paper before we commit."],
                ["Vendor-neutral", "MELSEC, SIMATIC, ICONICS, ABB — we choose what fits the plant, not the catalogue."],
                ["Documentation discipline", "Drawings, logic, I/O lists and HMI screens stay current. Every revision traceable."],
                ["Long-term support", "We design for the team that runs the plant after we leave. Maintainable, auditable, calm."],
              ].map(([t, b]) => (
                <div key={t} className="bg-[#0D1117] p-5">
                  <h4 className="font-[Montserrat] text-base text-[#E6EDF3] font-medium">{t}</h4>
                  <p className="mt-2 text-[#E6EDF3]/55 text-sm font-light leading-relaxed">{b}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
              <div className="sm:col-span-5 flex items-center gap-3 font-[Orbitron] text-[10px] tracking-[0.25em] text-[#E6EDF3]/50">
                <span className="w-8 h-px bg-[#2B313A]" />
                <span>YEARS IN THE FIELD</span>
                <span className="text-[#00C2FF] tabular text-base">11+</span>
              </div>

              <div className="sm:col-span-7 flex flex-wrap items-center justify-start sm:justify-end gap-5">
                {/* QR card — click to expand */}
                <button
                  type="button"
                  data-testid="founder-qr"
                  onClick={() => setQrOpen((v) => !v)}
                  className="group relative flex items-center gap-4 border border-[#2B313A] hover:border-[#00C2FF] bg-[#0D1117] p-3 transition-colors text-left"
                  aria-label="Click to enlarge QR code"
                >
                  <div className="relative w-24 h-24 bg-white p-1.5 shrink-0">
                    <img
                      src="/brand/vcard-qr.svg"
                      alt="Scan to add contact"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-[Orbitron] text-[9px] tracking-[0.3em] text-[#00C2FF]">
                      SCAN · vCARD
                    </span>
                    <span className="font-[Montserrat] text-sm text-[#E6EDF3] mt-1">
                      Click to enlarge
                    </span>
                    <span className="font-[Orbitron] text-[8px] tracking-[0.25em] text-[#E6EDF3]/40 mt-1">
                      Then point your camera →
                    </span>
                  </div>
                </button>

                {/* Download button */}
                <a
                  data-testid="founder-vcard-download"
                  href="/brand/vijay-shankar.vcf"
                  download="Vijay-Shankar-TASC.vcf"
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-6 py-4 border border-[#2B313A] text-[#E6EDF3] overflow-hidden hover:border-[#00C2FF] hover:text-[#0D1117] transition-colors inline-flex items-center gap-3"
                >
                  <span className="absolute inset-0 bg-[#00C2FF] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]" />
                  <Download size={14} strokeWidth={1.5} className="relative" />
                  <span className="relative">[ ADD TO CONTACTS ]</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged QR overlay */}
      {qrOpen && (
        <div
          data-testid="founder-qr-overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0D1117]/85 backdrop-blur-md p-6"
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
              className="w-full h-auto block"
              draggable={false}
            />
            <button
              type="button"
              data-testid="founder-qr-close"
              onClick={() => setQrOpen(false)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-[#0D1117] border border-[#00C2FF] text-[#00C2FF] flex items-center justify-center hover:bg-[#00C2FF] hover:text-[#0D1117] transition-colors"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            {/* Corner ticks for the industrial frame feel */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-[#00C2FF]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-[#00C2FF]" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-[#00C2FF]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-[#00C2FF]" />
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center font-[Orbitron] text-[10px] tracking-[0.3em] text-[#E6EDF3]/70">
            POINT YOUR PHONE CAMERA · CLICK TO CLOSE · AUTO-CLOSES IN 10 s
          </div>
        </div>
      )}
    </section>
  );
}
